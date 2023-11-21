export default {
      "Module.Item": {
            "type": "object",
            "properties": {
                  "module": {
                        "type": "string",
                        "enum": [
                              "todo",
                              "memo",
                              "note",
                              "kanban",
                              "workflow",
                              "whiteboard",
                              "ppt",
                              "schedule",
                              "pomodoro",
                              "flag",
                              "api",
                              "dataflow",
                              "table",
                              "form",
                              "chart",
                              "setting"
                        ],
                        "maxLength": 30
                  },
                  "dirtree": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "enum": [
                                                "dir",
                                                "file"
                                          ]
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "pid": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    },
                                    "icon_hue": {
                                          "type": "number"
                                    }
                              },
                              "required": [
                                    "type",
                                    "id",
                                    "name"
                              ]
                        }
                  }
            },
            "required": [
                  "module",
                  "dirtree"
            ]
      },
      "App.ModuleType": {
            "type": "string",
            "enum": [
                  "todo",
                  "memo",
                  "note",
                  "kanban",
                  "workflow",
                  "whiteboard",
                  "ppt",
                  "schedule",
                  "pomodoro",
                  "flag",
                  "api",
                  "dataflow",
                  "table",
                  "form",
                  "chart",
                  "setting"
            ],
            "maxLength": 30
      },
      "DirTree.Item": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "enum": [
                              "dir",
                              "file"
                        ]
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "pid": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": "number"
                  }
            },
            "required": [
                  "type",
                  "id",
                  "name"
            ]
      }
} as const