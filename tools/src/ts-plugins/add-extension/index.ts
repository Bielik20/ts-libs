import * as typescript from 'typescript';
import * as path from 'path';

type ImportExportNode = ImportNode | ExportNode;

type ImportNode = typescript.Node &
  typescript.ImportDeclaration & { moduleSpecifier: typescript.StringLiteral };

type ExportNode = typescript.Node &
  typescript.ExportDeclaration & { moduleSpecifier: typescript.StringLiteral };

export function before(config: unknown, program: typescript.Program) {
  return (transformationContext: typescript.TransformationContext) => {
    return (sourceFile: typescript.SourceFile) => {
      function visitNode(node: typescript.Node): typescript.VisitResult<typescript.Node> {
        if (shouldMutateModuleSpecifier(node)) {
          if (typescript.isImportDeclaration(node)) {
            return modifyImport(node);
          } else if (typescript.isExportDeclaration(node)) {
            return modifyExport(node);
          }
        }

        return typescript.visitEachChild(node, visitNode, transformationContext);
      }

      return typescript.visitNode(sourceFile, visitNode);
    };
  };
}

function shouldMutateModuleSpecifier(node: typescript.Node): node is ImportExportNode {
  if (!isImportExportNode(node)) {
    return false;
  }

  if (!isPathRelative(node.moduleSpecifier)) {
    return false;
  }

  if (hasExtension(node.moduleSpecifier)) {
    return false;
  }

  return true;
}

function isImportExportNode(node: typescript.Node): node is ImportExportNode {
  if (!typescript.isImportDeclaration(node) && !typescript.isExportDeclaration(node)) {
    return false;
  }

  return node.moduleSpecifier !== undefined && typescript.isStringLiteral(node.moduleSpecifier);
}

function isPathRelative(moduleSpecifier: typescript.StringLiteral): boolean {
  return moduleSpecifier.text.startsWith('./') || moduleSpecifier.text.startsWith('../');
}

function hasExtension(moduleSpecifier: typescript.StringLiteral): boolean {
  return path.extname(moduleSpecifier.text) !== '';
}

function modifyImport(node: ImportNode) {
  const newModuleSpecifier = makeModuleSpecifierWithExtension(node);

  return typescript.factory.updateImportDeclaration(
    node,
    node.decorators,
    node.modifiers,
    node.importClause,
    newModuleSpecifier,
    undefined,
  );
}

function modifyExport(node: ExportNode) {
  const newModuleSpecifier = makeModuleSpecifierWithExtension(node);

  return typescript.factory.updateExportDeclaration(
    node,
    node.decorators,
    node.modifiers,
    false,
    node.exportClause,
    newModuleSpecifier,
    undefined,
  );
}

function makeModuleSpecifierWithExtension(node: ImportExportNode) {
  return typescript.factory.createStringLiteral(`${node.moduleSpecifier.text}.js`);
}
