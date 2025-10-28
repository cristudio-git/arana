
  <?php include '../backend/includes/header.inc.php'; ?>
  <main class="flex-grow-1">

    <h1 class="mb-4 ms-4 display-6">Bienvenido al centro de investigacion</h1>
    <p class="mb-4 ms-4"></p>

   <div id="carouselIndex" class="carousel slide">

  <div class="carousel-inner text-center"> 
    <div class="carousel-item active">
      <img src="asset/img/viuda-negra.jpg" 
           class="d-block w-50 mx-auto" 
           style="max-height: 400px; object-fit: cover;" 
           alt="foto1Carrousel">
    </div>

    <div class="carousel-item">
      <img src="asset/img/phoneutria.jpg" 
           class="d-block w-50 mx-auto" 
           style="max-height: 400px; object-fit: cover;"  
           alt="foto2Carrousel">
    </div>

    <div class="carousel-item">
      <img src="asset/img/loxosceles-arana-del-rincon.jpg" 
           class="d-block w-50 mx-auto" 
           style="max-height: 400px; object-fit: cover;"  
           alt="foto3Carrousel">
    </div>
  </div>

  <button class="carousel-control-prev" type="button" data-bs-target="#carouselIndex" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Anterior</span>
  </button>

  <button class="carousel-control-next" type="button" data-bs-target="#carouselIndex" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Siguiente</span>
  </button>

</div>


  </main>


  <?php include '../backend/includes/footer.inc.php'; ?>
