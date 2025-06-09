<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- tes dlu buat diposts -->
       <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- font awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @vite('resources/css/app.css')
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
