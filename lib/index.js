var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/index.ts
__markAsModule(exports);
__export(exports, {
  activate: () => activate
});
var import_coc = __toModule(require("coc.nvim"));
var import_child_process = __toModule(require("child_process"));
var activate = async (context) => {
  context.subscriptions.push(import_coc.sources.createSource({
    name: "rg",
    doComplete: async ({input}) => {
      return await getCompletionItems({input: input.replace(/([\\\[\]^$.*])/g, "\\$1")});
    }
  }));
};
var options = [
  "--no-filename",
  "--no-heading",
  "--no-line-number",
  "--color=never",
  "--only-matching",
  "--word-regexp",
  "--ignore-case"
];
var getCompletionItems = async ({input}) => {
  input = input.replace(/^(?![a-zA-Z0-9])+/, "").replace(/^-+/, "");
  if (input.length < 2) {
    return {items: []};
  }
  const stdout = (0, import_child_process.execSync)(`rg ${options.join(" ")} ${input}[a-zA-Z0-9_-]+ ${process.cwd()}`, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 1e3
  });
  return {
    items: stdout.split("\n").map((word) => ({word, menu: "[rg]"}))
  };
};
