resource "cloudflare_pages_project" "smorgasbord" {
  account_id        = var.cloudflare_account_id
  name              = "smorgasbord"
  production_branch = "main"

  build_config {
    build_command   = "npm install && npm run build"
    root_dir        = "client"
    destination_dir = "dist"
  }

  source {
    type = "github"

    config {
      owner                         = "justlark"
      repo_name                     = "smorgasbord"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev"]
    }
  }
}

resource "cloudflare_pages_domain" "smorgasbord" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.smorgasbord.name
  domain       = "discuss.love"
}
