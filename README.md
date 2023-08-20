# ⚛ Small Reactive
🚀 Plug-and-play library for creating user interfaces based on reusable components

Content
=======
<!--ts-->
- [About](#about)
- [How to use](#how-to-use)
- [Install](#install)
  - [Via GIT:](#via-git)
  - [Via UGDM:](#via-ugdm)
- [Start app](#start-app)
  - [Example:](#example)
- [Licence](#licence)
- [Author](#author)
<!--te-->

## About
**Small Reactive** is a JavaScript library developed to easily create user interfaces based on reactive and reusable components, *without the need* to use *npm*, *babel*, heavy dependencies or transpilation processes, allowing the use directly in the source code and immediate execution in the browser.

## How to use
How to install and use Small Reactive

### Install
#### Via GIT:

- Clone Small Reactive repository inside your project:
```shell
git clone https://github.com/thiagofleal/small-reactive
```
- Install Small Reactive dependencies:
  - Linux:
  ```shell
  cd small-reactive && git checkout <version> && sh dependencies
  ```
  - Windows:
  ```batch
  cd small-reactive && git checkout <version> && call dependencies
  ```

#### Via [UGDM](https://github.com/thiagofleal/ugdm):
- Linux
```shell
  ugdm add small-reactive -l https://github.com/thiagofleal/small-reactive -v <version> -c "sh dependencies"
```
- Windows
```batch
  ugdm add small-reactive -l https://github.com/thiagofleal/small-reactive -v <version> -c "call dependencies"
```

### Start app
To start an Small Reactive application, is necessary an **HTML** file, a **main script** and at least one **component**. The HTML file must include the main script as a **module**, and the main script must call ```SmallReactive.start()``` method.

#### Example:

Project structure:
  |
  ├─  index.html                # index file
  ├─  vendor/                   # project dependencies
  |   └─  small-reactive        # Small Reactive library
  |       └─  ...
  └─  app/                      # Small Reactive project assets
      ├─  main.js               # main script (app starter)
      └─  components/           # components folder
          ├─  app.component.js  # main component
          └─  ...

- index.html
```html
<!doctype html>
<html>
  <head></head>
  <body>
    <div id="app"></div>
    <script type="module" src="app/main.js"></script>
  </body>
</html>
```

- main.js
```js
import { SmallReactive } from "../vendor/small-reactive/core.js";

import { AppComponent } from "./components/app.component.ts";

SmallReactive.start({
  target: "#app",
  component: AppComponent
});
```

- app.component.js
```js
import { Component } from "../../vendor/small-reactive/core.js";

export class AppComponent extends Component {
  constructor() {
    super();
  }

  render() {
    return /*html*/`
      <div>My first Small Reactive component</div>
    `;
  }
}
```

## Licence
MIT License

Copyright (c) 2023 Thiago Fernandes Leal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author
<a href="https://github.com/thiagofleal">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/33943433?v=4" width="100px;" alt=""/>
 <br />
 <sub><b>🚀 Thiago Leal</b></sub></a>


Made with ❤️ for Thiago Leal

[![Linkedin Badge](https://img.shields.io/badge/-Thiago%20Leal-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/thiago-leal-52363818a/)](https://www.linkedin.com/in/thiago-leal-52363818a/) 
[![Mail Badge](https://img.shields.io/badge/-thiagofernandesleal@yahoo.com.br-blue?style=flat-square&logo=Mail.ru&logoColor=white&link=mailto:thiagofernandesleal@yahoo.com.br)](mailto:thiagofernandesleal@yahoo.com.br)
