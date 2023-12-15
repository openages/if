export default {
      "ActivityItems.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "module": {
                        "type": "string"
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "name": {
                        "type": "string"
                  },
                  "action": {
                        "type": "string",
                        "enum": [
                              "insert",
                              "check"
                        ]
                  },
                  "timestamp": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "module",
                  "file_id",
                  "name",
                  "action",
                  "timestamp"
            ]
      },
      "Activity.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "module": {
                        "type": "string"
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "name": {
                        "type": "string"
                  },
                  "action": {
                        "type": "string",
                        "enum": [
                              "insert",
                              "check"
                        ]
                  },
                  "timestamp": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "module",
                  "file_id",
                  "name",
                  "action",
                  "timestamp"
            ]
      },
      "Activity.Action": {
            "type": "string",
            "enum": [
                  "insert",
                  "check"
            ]
      },
      "Activity.TodoAction": {
            "type": "string",
            "enum": [
                  "insert",
                  "check"
            ]
      }
} as const