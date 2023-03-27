# Project Coding Guidelines

## General Guidelines
- Use meaningful names for variables, functions, and classes.
- Follow the Single Responsibility Principle (SRP).
- Write clean and readable code.
- Aim for code reusability.
- Keep the code DRY (Don't Repeat Yourself).
- Use comments where necessary.
- Write concise and descriptive commit messages.

## Naming Conventions
- Use camelCase for variable, function, and class names.
- Use PascalCase for type names.
- Prefix private properties and methods with an underscore.
- Avoid using single-letter variable names.

## Formatting
- Use two spaces for indentation.
- Use semicolons to end statements.
- Use single quotes for string literals.
- Avoid lines longer than 80 characters.
- Use blank lines to separate logical blocks of code.
- Keep the opening brace on the same line as the function or class declaration.
- Use parentheses around the condition of an `if` statement, unless it's a single-line `if`.
- Always use braces for `if`, `else`, `for`, and `while` statements, even for single-line blocks.

## TypeScript Specific Guidelines
- Use TypeScript's built-in types wherever possible.
- Use type aliases for complex types.
- Avoid using the `any` type unless absolutely necessary.
- Use optional properties instead of the `undefined` type, where appropriate.
- Use readonly properties where possible.
- Avoid using the `!` operator to assert that a variable is not null or undefined.

## Linting
- Use a TypeScript linter to enforce these guidelines and catch common errors.
- Configure the linter to match these guidelines and the specific needs of your project.
- Run the linter as part of your build process, and fix any errors or warnings before committing code.

## Microservices architecture
- Remember that Microservices are to be treated as siloed blocks of functionality.
- Remember to update (or .gitignore when completed) the Dockerfile for each repo. 
- Update Documentation frequently.
- Ensure environment configurations are properly configured, and .gitignore after finalised.
- Do ensure that merges to main are sanitised, ensure tests pass.
- Merges to main on each repository trigger CodePipeline and CodeDeploy workflows. Ensure DevOps has enabled this and ensure endpoints in environment config are set accurately to grab their information from the Cloud config files
- Ensure best practices are followed when developing features.
