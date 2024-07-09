resource "cloudflare_workers_kv_namespace" "smorgasbord" {
  account_id = var.cloudflare_account_id
  title      = "smorgasbord"
}
