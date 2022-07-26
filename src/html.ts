export const HTML = `
<!DOCTYPE html>
<html lang="de">
  <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
      <meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
      <style type="text/css">
          html,body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color:rgba(0, 0, 0, 0);
          }
          #main {
          height: 100%;
          width: 100%;
          background-color:rgba(0, 0, 0, 0);
          }
      </style>
      
      <script>
          ${require('echarts')}
      </script>
  </head>
  <body>
      <div id="main">
      </div>
  </body>
</html>`;
