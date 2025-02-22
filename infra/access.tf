resource "cloudflare_zero_trust_access_application" "smorgasbord_preview" {
  zone_id                   = data.cloudflare_zone.smorgasbord.id
  name                      = cloudflare_pages_project.smorgasbord.name
  domain                    = cloudflare_pages_domain.smorgasbord_dev.domain
  type                      = "self_hosted"
  session_duration          = "720h"
  auto_redirect_to_identity = true
  app_launcher_visible      = false

  policies = []
}

resource "cloudflare_zero_trust_access_policy" "smorgasbord_preview" {
  zone_id        = data.cloudflare_zone.smorgasbord.id
  application_id = cloudflare_zero_trust_access_application.smorgasbord_preview.id
  name           = cloudflare_pages_project.smorgasbord.name
  decision       = "allow"
  precedence     = 1

  include {
    email = var.cloudflare_access_emails
  }

  require {
    email = var.cloudflare_access_emails
  }
}

resource "cloudflare_list" "pages_dev_domains" {
  account_id  = var.cloudflare_account_id
  kind        = "redirect"
  name        = "pages_dev_domains"
  description = "List of *.pages.dev domains"
}

# resource "cloudflare_list_item" "smorgasbord_pages_dev_domain" {
#   account_id = var.cloudflare_account_id
#   list_id    = cloudflare_list.pages_dev_domains.id

#   redirect {
#     source_url            = "${cloudflare_pages_project.smorgasbord.subdomain}/"
#     target_url            = "https://${cloudflare_pages_domain.smorgasbord.domain}"
#     status_code           = 301
#     include_subdomains    = "enabled"
#     preserve_query_string = "enabled"
#     subpath_matching      = "enabled"
#     preserve_path_suffix  = "enabled"
#   }
# }

# Create a single ruleset for all redirect lists in the account, because
# Cloudflare does not permit you to accomplish this using multiple rulesets.
resource "cloudflare_ruleset" "redirect_pages_dev_domains" {
  account_id = var.cloudflare_account_id
  name       = "bulk redirect *.pages.dev domains"
  kind       = "root"
  phase      = "http_request_redirect"

  rules {
    action = "redirect"

    action_parameters {
      from_list {
        name = cloudflare_list.pages_dev_domains.name
        key  = "http.request.full_uri"
      }
    }

    expression  = "http.request.full_uri in ${format("$%s", cloudflare_list.pages_dev_domains.name)}"
    description = "Apply redirects from ${cloudflare_list.pages_dev_domains.name}"
    enabled     = true
  }
}
