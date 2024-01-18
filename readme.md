# сборка GULP-2024_webpak

## Общие правила работы

* работаем только в директории $devDir, включая изменения в html (index.html компилируется и переносится в корень именно оттуда)
* index.html берет все зависимости и ресурсы из директории $resultDir
* gulp build переносит index.html, $jsResult, $cssResult и всю структуру и содержимое $resultDir в $distDir
* при запуске gulp и gulp build файлы в $rootDir и все содержимое $resultDir удаляется
* после выполнения gulp build в директории $resultDir находится полностью автономный работоспособный сайт, готовый к выгрузке на хостинг

---
## Настройка проекта

*  CONFIG - в начале работы определите структуру проекта и базовое содержимое файлов в секции CONFIG
*  CSS - выберите использование препроцессора либо чистый css в секции STYLE
*  JS - все библиотеки и зависимости подключаются в файле $jsDev
*  ANY FILES - настройте копирование любых других файлов и каталогов в секции COPY
*  GITHUB_REPOSITORY - в файле package.json определите путь к удаленному репозиторию проекта:  "env": {"GITHUB_REPOSITORY": "https://github.com/<username>/<repository_name>"}

---

## Порядок использования

*  gulp create
> создание первичной структуры проекта
*  gulp 
> сборка проекта с запуском watch (html, css, js) и browserSync
*  gulp build 
> сборка билда с выгрузкой в каталог $distDir
*  gulp deploy
> выгрузка билда из каталога $distDir в удаленный репозиторий github-page (путь определяет GITHUB_REPOSITORY))
 