import { Posts } from '@/components/posts/posts'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
   <Posts />
  )
}