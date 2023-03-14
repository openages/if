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
                              "pomodoro",
                              "schedule",
                              "kanban",
                              "flow",
                              "board",
                              "project",
                              "table",
                              "bi",
                              "ppt"
                        ],
                        "maxLength": 12
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
                                    "children": {
                                          "type": "array",
                                          "items": {
                                                "type": "object",
                                                "properties": {
                                                      "type": {
                                                            "type": "string",
                                                            "const": "file"
                                                      },
                                                      "target_id": {
                                                            "type": "string"
                                                      },
                                                      "counts": {
                                                            "type": "number"
                                                      },
                                                      "id": {
                                                            "type": "string"
                                                      },
                                                      "name": {
                                                            "type": "string"
                                                      },
                                                      "icon": {
                                                            "type": "string"
                                                      }
                                                },
                                                "required": [
                                                      "id",
                                                      "name",
                                                      "target_id",
                                                      "type"
                                                ]
                                          }
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    },
                                    "target_id": {
                                          "type": "string"
                                    },
                                    "counts": {
                                          "type": "number"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name",
                                    "type"
                              ]
                        }
                  }
            },
            "required": [
                  "module",
                  "dirtree"
            ]
      },
      "App.RealModuleType": {
            "type": "string",
            "enum": [
                  "todo",
                  "memo",
                  "note",
                  "pomodoro",
                  "schedule",
                  "kanban",
                  "flow",
                  "board",
                  "project",
                  "table",
                  "bi",
                  "ppt"
            ],
            "maxLength": 12
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
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "const": "file"
                                    },
                                    "target_id": {
                                          "type": "string"
                                    },
                                    "counts": {
                                          "type": "number"
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name",
                                    "target_id",
                                    "type"
                              ]
                        }
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "target_id": {
                        "type": "string"
                  },
                  "counts": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "name",
                  "type"
            ]
      },
      "DirTree.Dir": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "dir"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "const": "file"
                                    },
                                    "target_id": {
                                          "type": "string"
                                    },
                                    "counts": {
                                          "type": "number"
                                    },
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    },
                                    "icon": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name",
                                    "target_id",
                                    "type"
                              ]
                        }
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  }
            },
            "required": [
                  "children",
                  "id",
                  "name",
                  "type"
            ]
      },
      "DirTree.File": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "file"
                  },
                  "target_id": {
                        "type": "string"
                  },
                  "counts": {
                        "type": "number"
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  }
            },
            "required": [
                  "id",
                  "name",
                  "target_id",
                  "type"
            ]
      }
} as const