export default {
      "ModuleSetting.Item": {
            "type": "object",
            "properties": {
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "module": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "setting": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "update_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "file_id",
                  "module",
                  "setting",
                  "create_at"
            ]
      }
} as const