export default {
      "Setting.Data": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "data": {
                        "type": "string"
                  }
            },
            "required": [
                  "id",
                  "data"
            ]
      }
} as const