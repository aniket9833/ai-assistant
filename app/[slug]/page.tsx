import { redirect } from 'next/navigation';

export default function SlugIndex({ params }: { params: { slug: string } }) {
  redirect(`/${params.slug}/chat`);
}
