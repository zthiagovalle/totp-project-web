# TOTP Tools

A web-based TOTP (Time-based One-Time Password) utility built with React and Vite. This tool lets you generate TOTP codes, view upcoming and previous codes, and check if a code existed within a given period. It’s designed for developers who need to work with TOTP for authentication, testing, or auditing.

## Notable Libraries and Technologies

- [React](https://react.dev/) for UI development.
- [Vite](https://vitejs.dev/) for fast development and build tooling.
- [Chakra UI](https://chakra-ui.com/) for accessible, themeable UI components.
- [totp-generator](https://www.npmjs.com/package/totp-generator) for TOTP code generation.
- [use-debounce](https://www.npmjs.com/package/use-debounce) for debounced state updates.
- [react-icons](https://react-icons.github.io/react-icons/) for iconography.
- [vite-plugin-node-polyfills](https://www.npmjs.com/package/vite-plugin-node-polyfills) for Node.js polyfills in the browser.

## Project Structure

```
.gitignore
.prettierrc
eslint.config.js
index.html
package.json
README.md
vite.config.js
public/
src/
  features/
  hooks/
```

- **public/**: Static assets, including SVG icons.
- **src/features/**: Core React components and logic for TOTP generation, timeline, and history checking.
- **src/hooks/**: Custom React hooks for TOTP code and
