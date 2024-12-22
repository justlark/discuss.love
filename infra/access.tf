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
  name        = "smorgasbord_pages_dev_domains"
  description = "List of *.smorgasbord.pages.dev domains"

  item {
    value {
      redirect {
        source_url            = "${cloudflare_pages_project.smorgasbord.subdomain}/"
        target_url            = "https://${cloudflare_pages_domain.smorgasbord.domain}"
        status_code           = 301
        include_subdomains    = "enabled"
        preserve_query_string = "enabled"
        subpath_matching      = "enabled"
        preserve_path_suffix  = "enabled"
      }
    }
  }
}

data "cloudflare_lists" "this" {
  account_id = var.cloudflare_account_id
}

locals {
  redirect_lists = toset([for domains_list in data.cloudflare_lists.this.lists : domains_list.name if domains_list.kind == "redirect"])
}

# Create a single ruleset for all redirect lists in the account, because
# Cloudflare does not permit you to accomplish this using multiple rulesets.
resource "cloudflare_ruleset" "redirect_bulk_domains" {
  account_id = var.cloudflare_account_id
  name       = "bulk redirect domains"
  kind       = "root"
  phase      = "http_request_redirect"

  dynamic "rules" {
    for_each = local.redirect_lists
    iterator = list_name

    content {
      action = "redirect"

      action_parameters {
        from_list {
          name = list_name.key
          key  = "http.request.full_uri"
        }
      }

      expression  = "http.request.full_uri in ${format("$%s", list_name.key)}"
      description = "Apply redirects from ${list_name.key}"
      enabled     = true
    }
  }
}
