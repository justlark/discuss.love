resource "cloudflare_workers_kv_namespace" "smorgasbord" {
  account_id = var.cloudflare_account_id
  title      = "smorgasbord"
}

resource "cloudflare_workers_kv_namespace" "smorgasbord_dev" {
  account_id = var.cloudflare_account_id
  title      = "smorgasbord-dev"
}
