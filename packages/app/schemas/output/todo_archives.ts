export default {
      "TodoArchive.Item": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "todo"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ],
                        "maxLength": 12
                  },
                  "star": {
                        "type": "number"
                  },
                  "archive_time": {
                        "type": "number",
                        "multipleOf": 1,
                        "minimum": 1,
                        "maximum": 9999999999000
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle_enabled": {
                        "type": "boolean"
                  },
                  "circle_value": {
                        "type": "array",
                        "items": {
                              "type": "number"
                        }
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "circle_enabled",
                  "create_at",
                  "file_id",
                  "id",
                  "status",
                  "text",
                  "type"
            ]
      },
      "Todo.Todo": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "todo"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ],
                        "maxLength": 12
                  },
                  "star": {
                        "type": "number"
                  },
                  "archive_time": {
                        "type": "number",
                        "multipleOf": 1,
                        "minimum": 1,
                        "maximum": 9999999999000
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle_enabled": {
                        "type": "boolean"
                  },
                  "circle_value": {
                        "type": "array",
                        "items": {
                              "type": "number"
                        }
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "circle_enabled",
                  "create_at",
                  "file_id",
                  "id",
                  "status",
                  "text",
                  "type"
            ]
      }
} as const