# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

---

## 🤖 GitHub Copilot - Contexto Persistente

Este proyecto utiliza **instrucciones personalizadas de GitHub Copilot** para mantener contexto entre sesiones.

### ✅ Cómo Funciona

**El archivo `.github/copilot-instructions.md`** es leído automáticamente por GitHub Copilot al inicio de cada nueva sesión de chat. Esto significa:

1. **Persistencia entre sesiones**: Cada vez que abras una nueva conversación con Copilot en este proyecto, leerá ese archivo y tendrá todo el contexto.

2. **Contexto acumulativo**: Puedes ir añadiendo información nueva según vaya surgiendo:
   - Patrones específicos que descubras
   - Reglas de negocio importantes
   - Convenciones de código que establezcas
   - Configuraciones especiales

3. **Alcance del workspace**: Estas instrucciones solo aplican a este proyecto específico (anyclazz-portal).

### 📝 Cómo Actualizar el Contexto

Cuando surjan cosas nuevas, simplemente pide a Copilot:
- "Añade al contexto que..."
- "Actualiza las instrucciones para incluir..."
- "Documenta que ahora usamos X patrón para Y"

Y Copilot actualizará el archivo `.github/copilot-instructions.md` para mantener el conocimiento persistente.

### 💡 Ventajas

- ✅ No necesitas repetir el contexto en cada sesión
- ✅ Copilot generará código más alineado con tus convenciones
- ✅ Mantienes documentadas las decisiones arquitectónicas del proyecto
- ✅ Nuevos desarrolladores pueden leer el archivo para entender el proyecto

### 📂 Archivos de Configuración

- `.github/copilot-instructions.md` - Instrucciones principales y reglas del proyecto
- `.vscode/settings.json` - Configuración del editor (cuando se cree)
- `.vscode/snippets.code-snippets` - Snippets personalizados (cuando se cree)
