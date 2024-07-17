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
      repo_name                     = "discuss.love"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev"]
    }
  }

  deployment_configs {
    production {
      environment_variables = {
        VITE_API_URL = "https://api.${data.cloudflare_zone.smorgasbord.name}"
      }
      usage_model = "standard"
    }

    preview {
      environment_variables = {
        VITE_API_URL = "https://api-dev.${data.cloudflare_zone.smorgasbord.name}"
      }
      usage_model = "standard"
    }
  }
}

resource "cloudflare_pages_domain" "smorgasbord" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.smorgasbord.name
  domain       = data.cloudflare_zone.smorgasbord.name
}
