
  <?php include '../backend/includes/header.inc.php'; ?>
  <main class="flex-grow-1">

    <h1 class="mb-4 ms-4 display-6">Bienvenido al centro de investigacion</h1>
    <p class="mb-4 ms-4">Nuestro proposito es conocer todas las especies de arañas</p>

    <div id="carouselExample" class="carousel slide">

      <div class="carousel-inner">

        <div class="carousel-item active">
          <img src="#sset/img/argentata00.jpg" class="d-block w-100" style="max-height: 400px; object-fit: cover;" alt="foto1Carrousel">
        </div>

        <div class="carousel-item">
          <img src="#" class="d-block w-100" style="max-height: 400px; object-fit: cover;"  alt="foto2Carrousel">
        </div>

        <div class="carousel-item">
          <img src="#" class="d-block w-100" style="max-height: 400px; object-fit: cover;"  alt="foto3Carrousel">
        </div>

      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>

      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>

    </div>

  </main>


  <?php include '../backend/includes/footer.inc.php'; ?>
