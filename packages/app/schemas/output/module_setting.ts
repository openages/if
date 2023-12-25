export default {
      "ModuleSetting.Item": {
            "type": "object",
            "properties": {
                  "module": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "setting": {
                        "type": "string"
                  }
            },
            "required": [
                  "module",
                  "file_id",
                  "setting"
            ]
      }
} as const