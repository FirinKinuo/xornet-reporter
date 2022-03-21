use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::path::Path;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
  pub access_token: String,
  pub backend_hostname: String,
  pub uuid: String,
  pub docker_integration: Option<bool>,
}

/// Manages the config.json for the reporter
#[derive(Clone, Debug)]
pub struct ConfigManager {
  pub config: Config,
}

impl ConfigManager {
  pub fn new() -> Result<ConfigManager> {
    let config = ConfigManager::load_config()?;
    return Ok(Self { config });
  }

  pub fn save_access_token(access_token: &str) -> Result<()> {
    let mut config = ConfigManager::load_config()?;
    config.access_token = access_token.to_string();
    ConfigManager::save_config(config)?;
    return Ok(());
  }

  /// Saves the modified config to the config file
  pub fn save_config(config: Config) -> Result<()> {
    let file = File::create("config.json")?;
    serde_json::to_writer_pretty(file, &config)?;
    return Ok(());
  }

  /// Loads the config file from disk or creates a new one if it doesn't exist.
  pub fn load_config() -> Result<Config> {
    if !Path::new("config.json").exists() {
      return Ok(ConfigManager::create_config()?);
    } else {
      let file = File::open("config.json")?;

      let result = serde_json::from_reader(file);
      return match result {
        Ok(config) => {
          let mut config: Config = config;
          if config.uuid.is_empty() {
            config.uuid = ConfigManager::create_uuid();
          }
          if config.backend_hostname.is_empty() {
            config.uuid = "backend.xornet.cloud".to_string();
          }
          if config.docker_integration.is_none() {
            config.docker_integration = Some(false);
          }
          ConfigManager::save_config(config.clone())?;
          return Ok(config);
        }
        Err(_) => Ok(ConfigManager::create_config()?),
      };
    }
  }

  pub fn create_uuid() -> String {
    return Uuid::new_v4().to_string();
  }

  /// Creates a new config file with an empty access token and default backend address.
  pub fn create_config() -> Result<Config> {
    let config = Config {
      access_token: String::new(),
      backend_hostname: "backend.xornet.cloud".to_string(),
      uuid: ConfigManager::create_uuid(),
      docker_integration: Some(false),
    };
    ConfigManager::save_config(config.clone())?;
    return Ok(config);
  }
}
