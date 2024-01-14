export default {
      "ActivityItems.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "module": {
                        "type": "string",
                        "maxLength": 15
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
                  "update_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "module",
                  "file_id",
                  "name",
                  "action"
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
                        "type": "string",
                        "maxLength": 15
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
                  "update_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "module",
                  "file_id",
                  "name",
                  "action"
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