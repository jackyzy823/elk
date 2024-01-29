import { withoutProtocol } from 'ufo'
import type { mastodon } from 'masto'

//Not sure if i guessed right
//  /:server?/@:account from pages/[[server]]/@[account]/index.vue
// We always show account under its original server instance name
// @xxx@server.com -> server.com is not always the same as apiendpoint
// Using a different domain name for Mastodon and the users it serves
// https://docs.joinmastodon.org/admin/config/#local_domain
// https://github.com/felx/mastodon-documentation/blob/master/Running-Mastodon/Serving_a_different_domain.md
// You need to request https://localdomain/.well-known/host-meta to get xml webdomain/webflinger?resource=
// Then request   webdomain/webflinger?resource=acc@localdomain
// Then get alias from respoonse
// Or we just use account.url
export function getAccountRoute(account: mastodon.v1.Account) {
  const [ server , handle ] = withoutProtocol(account.url).split('/@')
  return useRouter().resolve({
    name: 'account-index',
    params: {
      server: server,
      account: handle,
    },
  })
}
export function getAccountFollowingRoute(account: mastodon.v1.Account) {
  return useRouter().resolve({
    name: 'account-following',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}
export function getAccountFollowersRoute(account: mastodon.v1.Account) {
  return useRouter().resolve({
    name: 'account-followers',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}

export function getReportRoute(id: string | number) {
  return `https://${currentUser.value?.server}/admin/reports/${encodeURIComponent(id)}`
}

export function getStatusRoute(status: mastodon.v1.Status) {
  return useRouter().resolve({
    name: 'status',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(status.account),
      status: status.id,
    },
  })
}

export function getTagRoute(tag: string) {
  return useRouter().resolve({
    name: 'tag',
    params: {
      server: currentServer.value,
      tag,
    },
  })
}

export function getStatusPermalinkRoute(status: mastodon.v1.Status) {
  return status.url ? withoutProtocol(status.url) : null
}

export function getStatusInReplyToRoute(status: mastodon.v1.Status) {
  return useRouter().resolve({
    name: 'status-by-id',
    params: {
      server: currentServer.value,
      status: status.inReplyToId,
    },
  })
}

export function navigateToStatus({ status, focusReply = false }: {
  status: mastodon.v1.Status
  focusReply?: boolean
}) {
  return navigateTo({
    path: getStatusRoute(status).href,
    state: { focusReply },
  })
}
