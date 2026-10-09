import { redirect } from '@tanstack/react-router'
import type { RouterContext } from '@/routes/__root'
import { bypassAuth } from './env'

export interface GuardParams {
  context: RouterContext
  location: { href: string }
}

/**
 * Reusable guard to protect routes in TanStack Router.
 * Can be used directly in a route's `beforeLoad` or in a layout route.
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/dashboard')({
 *   beforeLoad: requireAuth,
 *   component: DashboardComponent,
 * })
 * ```
 */
export const requireAuth = ({ context, location }: GuardParams) => {
  if (bypassAuth) return

  if (!context.auth?.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
}
