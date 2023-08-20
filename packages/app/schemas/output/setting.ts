export default {
      "Setting.Data": {
            "type": "object",
            "properties": {
                  "key": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "data": {
                        "type": "string"
                  }
            },
            "required": [
                  "key",
                  "data"
            ]
      }
} as const