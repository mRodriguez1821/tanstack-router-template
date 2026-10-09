import { createFileRoute, redirect } from '@tanstack/react-router'
import { bypassAuth } from '@/common/lib/env'
import { ProtectedLayout } from '@/common/components/layout/ProtectedLayout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (bypassAuth) return

    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: ProtectedLayout,
})
