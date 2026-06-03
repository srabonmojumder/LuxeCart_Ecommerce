'use client';

import { useState } from 'react';
import { UserCircle, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { api, ApiError } from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

const SKY = '#46AEE8';
const field = 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-slate-800 disabled:opacity-60';
const label = 'text-[10px] font-black uppercase tracking-widest text-slate-400';
const btn = 'w-full sm:w-auto px-10 py-3.5 text-white rounded-xl font-bold uppercase tracking-wider text-xs disabled:opacity-60';

export default function AdminProfilePage() {
    const user = useAuthStore((s) => s.user);
    const refreshUser = useAuthStore((s) => s.refreshUser);

    const [displayName, setDisplayName] = useState(user?.displayName ?? '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
    const [savingProfile, setSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [savingPw, setSavingPw] = useState(false);

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await api.patch('/account/profile', { displayName, photoURL: photoURL || null }, true);
            await refreshUser();
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Update failed');
        } finally {
            setSavingProfile(false);
        }
    };

    const savePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setSavingPw(true);
        try {
            await api.post('/auth/change-password', { currentPassword: currentPassword || undefined, newPassword }, true);
            toast.success('Password changed');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to change password');
        } finally {
            setSavingPw(false);
        }
    };

    return (
        <div className="space-y-5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* account / profile */}
            <form onSubmit={saveProfile} className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-5">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-800"><UserCircle className="w-4 h-4" style={{ color: SKY }} /> Account</h2>

                <div className="space-y-1.5">
                    <label className={label}>Profile Photo</label>
                    <ImageUpload value={photoURL} onChange={setPhotoURL} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className={label}>Display Name</label><input className={field} value={displayName} onChange={(e) => setDisplayName(e.target.value)} required /></div>
                    <div className="space-y-1.5"><label className={label}>Email (read-only)</label><input className={field} value={user?.email ?? ''} disabled /></div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Shield className="w-4 h-4 text-slate-400" /> Role:
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${SKY}1a`, color: SKY }}>{user?.role ?? '—'}</span>
                </div>

                <button type="submit" disabled={savingProfile} className={btn} style={{ backgroundColor: SKY }}>
                    {savingProfile ? 'Saving…' : 'Save Profile'}
                </button>
            </form>

            {/* change password */}
            <form onSubmit={savePassword} className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-4">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-800"><Lock className="w-4 h-4" style={{ color: SKY }} /> Change Password</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5"><label className={label}>Current Password</label><input type="password" className={field} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" /></div>
                    <div className="space-y-1.5"><label className={label}>New Password</label><input type="password" className={field} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" required /></div>
                </div>
                <button type="submit" disabled={savingPw} className={btn} style={{ backgroundColor: SKY }}>
                    {savingPw ? 'Updating…' : 'Update Password'}
                </button>
            </form>
            </div>
        </div>
    );
}
