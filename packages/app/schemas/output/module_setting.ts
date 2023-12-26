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
                  }
            },
            "required": [
                  "file_id",
                  "module",
                  "setting"
            ]
      }
} as const