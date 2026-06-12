import BlogPostClient from './BlogPostClient';

// Blog is a dynamic feature on the `backend` branch — there are no static posts
// here. `output: export` needs at least one param, so we emit a single
// placeholder route that renders the client's "post not found" state. Nothing
// links to it, so it's effectively unreachable.
export function generateStaticParams() {
    return [{ slug: 'post' }];
}

export default function BlogPostPage() {
    return <BlogPostClient />;
}
