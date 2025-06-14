import React, { useEffect, useRef, useState } from "react";
import HomeLayout from '@/Layouts/HomeLayout';
import { Head, usePage, Link, router } from '@inertiajs/react'
import Swal from 'sweetalert2';


export default function Index({post_types, categories, seo}) {
  const truncateText = (htmlString, maxLength) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        const plainText = div.textContent || div.innerText || '';
        if (plainText.length > maxLength) {
            return plainText.substring(0, maxLength) + '..Baca selengkapnya';
        }
        return plainText;
  }
  
    useEffect(() => {
      const isMobile = window.innerWidth < 768;

      AOS.init({
        duration: isMobile ? 600 : 800,
        once: true,
        easing: 'ease-out',
      });
    }, []);

    const sectionRef1 = useRef(null);
    const scrollToSection1 = () => {
      sectionRef1.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // SWEETALERT
    const { flash } = usePage().props;
    const [shownAlert, setShownAlert] = useState(false);

    // ALERT 
    useEffect(() => {
      if (!shownAlert && (flash.success || flash.info || flash.error)) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        let icon = "info";
        let title = flash.info;
        if (flash.success) {
          icon = "success";
          title = flash.success;
        } else if (flash.error) {
          icon = "error";
          title = flash.error;
        }

        Toast.fire({ icon, title });
        setShownAlert(true);
      }
    }, [flash, shownAlert]);
    // ALERT END

  return (
    <>
        <Head>
          <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
          <meta itemprop="name" content={seo.brand_name} />
          <meta name="description" content={seo.description} />
          <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
          <title>Beranda</title>
        </Head>
        <HomeLayout post_types={post_types} seo={seo}>
        <section className="relative w-full min-h-screen flex items-center bg-secondary-background overflow-hidden pt-5 lg:pt-32 pb-24 sm:pb-32 lg:pb-48">
          {/* wave separator */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-primary-background rounded-t-3xl z-[1]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="grid lg:grid-cols-2 lg:gap-20 items-center h-full">
              {/* === Text column === */}
              <div className="order-2 lg:order-1 flex flex-col h-full z-20">
                {/* title */}
                <h1
                  data-aos="fade-up"
                  data-aos-delay="0"
                  data-aos-duration="800"
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-text leading-tight"
                >
                  Belajar santai, <br />skill naik level! 🚀
                </h1>

                {/* subtitle */}
                <p
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="800"
                  className="mt-4 text-base md:text-lg text-secondary-text bg-secondary-background rounded-md px-4 py-3 border-l-4 border-secondary-btn"
                >
                  ✍️ Jelajahi blog seru penuh insight! <br className="hidden sm:block" />
                  Mulai dari tips coding, mindset belajar, sampai cara leveling skill kamu—semua dibahas ringan & fun!
                </p>

                {/* CTA */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="800"
                  className="mt-8 flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={scrollToSection1}
                    className="bg-primary-btn text-primary-text font-bold py-2 px-4 rounded-lg hover:bg-secondary-btn transition"
                  >
                    🚀 Jelajahi Sekarang
                  </button>
                </div>
              </div>

              {/* === Image column === */}
              <div
                data-aos="zoom-in"
                data-aos-delay="300"
                data-aos-duration="500"
                className="order-1 lg:order-2 flex justify-center mt-7 lg:mt-0"
              >
                <img
                  src="/storage/Images/Illustration/hero.png"
                  alt="Hero illustration"
                  className="w-full max-w-[280px] md:max-w-[360px] lg:max-w-[400px] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>


          {/* CATEGORY SECTION */}
          <section>
            {categories && categories.length > 0 && (
              <div className="max-w-6xl mx-auto px-4 mt-20">
                  <h2 className="text-2xl font-bold text-primary-text mb-3">Kategori</h2>
                  <p className="text-lg font-bold text-secondary-text mb-6">Temukan tutorial berdasarkan minatmu.</p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center"> 
                      {categories.map((cat, i) => (
                          <Link
                              key={cat.id}
                              href={`/post/category/${cat.slug}`}
                              className="group bg-secondary-background flex items-center space-x-4 p-4 rounded-lg hover:shadow-md transition-all duration-300 w-full sm:w-[calc(50%-12px)] md:w-[calc(45.33%-16px)] lg:w-[calc(35%-18px)]" 
                              data-aos="fade-up"
                              data-aos-delay={i * 100}
                              data-aos-duration="500"
                              >
                              <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border-2 border-primary-text shadow-md bg-primary-background">
                                  <img
                                      src={cat.image ? `/storage/Images/Categories/${cat.image}` : "/storage/Images/Posts/Thumbnails/default-category.png"}
                                      alt={cat.name}
                                      className="w-full h-full object-cover"
                                  />
                              </div>
                              <div className="flex-grow text-left"> 
                                  <span className="text-lg font-semibold text-primary-text hover:text-primary-btn">
                                      {cat.name}
                                  </span>
                                  <p className="text-sm text-secondary-text mt-1">{cat.description}</p>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
            )}
          </section>
          {/* CATEGORY SECTION END*/}

          <section ref={sectionRef1} className="scroll-mt-20 ">
            {/* DYNAMIC POST */}
            {post_types.map((postType) => {
              const title = postType.name; 
              const desc = postType.description; 
              const posts = postType.posts;
              const iconPath = postType.icon; 

              if (!posts || posts.length === 0) {
                  return null;
              }

              return (
                  <section key={postType.id} className="max-w-6xl mx-auto px-4 mt-17" ref={sectionRef1}>
                      <h2 className="text-2xl font-bold text-primary-text mb-6">
                          {iconPath && <img src={`/storage/Images/PostTypes/${iconPath}`} alt={`${title} Icon`} className="inline-block w-8 h-8 mr-2" />}
                          {title}
                      </h2>
                      <p className="text-lg font-bold text-secondary-text mb-6">{desc}</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {posts.map((post, i) => (
                            
                              <Link 
                              href={`/post/${post.slug}`} 
                              key={post.id} 
                              data-aos="fade-up"
                              data-aos-delay={i * 100}
                              data-aos-duration="500"
                              data-aos-easing="ease-in-out"
                              className="block group bg-secondary-background p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:no-underline">
                                  <div className="aspect-video bg-white rounded-xl overflow-hidden mb-4">
                                      <img
                                          src={`/storage/Images/Posts/Thumbnails/${post.thumbnail}`}
                                          alt={post.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 "
                                      />
                                  </div>
                                  {post.category && (
                                      <span className="bg-primary-btn text-primary-text text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md mb-2 inline-block">
                                          {post.category.name}
                                      </span>
                                  )}
                                  <h3 className="text-lg font-semibold text-primary-text mb-2 group-hover:text-primary-btn transition duration-300">{post.title}</h3>
                                  <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none rounded-lg mt-4 text-secondary-text">
                                      <p>{truncateText(post.content, 70)}</p>
                                  </div>
                              </Link>
                            
                          ))}
                      </div>
                      <div className="btn-selengkapnya flex justify-center p-2 py-6">
                          <Link href={`/post/type/${postType.slug}`} className="text-center text-secondary-text text-md font-bold">Lihat Semua.. </Link>
                      </div>
                  </section>
              );
            })}
            {/* END DYNAMIC POST */}
          </section>



        {/* TENTANG SECTION */}
        <section className="relative w-full about-us-section flex items-center bg-secondary-background overflow-hidden mt-20 p-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 lg:gap-20 items-center h-full">

              <div
                className="order-1 md:order-1 lg:order-1 z-20 flex flex-col items-center justify-center h-full"
              >
                <div
                  className="bg-primary-background up-down z-20 flex flex-col items-center rounded-xl p-2 sm:p-3 w-full max-w-[250px] md:max-w-[350px] lg:max-w-[300px] hover:scale-105 transition
                  h-full"
                  style={{ animationDelay: "0s" }}
                >
                  <img
                    src="/storage/Images/Illustration/team.png"
                    alt="Tentang Kami Ilustrasi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div
                className="order-2 md:order-2 lg:order-2 w-full flex flex-col justify-center h-full mt-7 md:mt-0 lg:mt-0"
              >
                <h3 className="title text-2xl sm:text-2xl md:text-2xl font-bold text-primary-text leading-tight text-left">
                  Tentang {seo.brand_name}: <br />Misi dan Visi Kami
                </h3>

                <p className="sub-title shadow mt-4 text-base md:text-lg text-secondary-text bg-secondary-background rounded-md px-4 border-l-4 border-secondary-btn text-left">
                    Di era teknologi dan AI yang terus berkembang, kami percaya bahwa belajar harus adaptif, menyenangkan, dan tanpa batas. {seo.brand_name} hadir untuk menghadirkan konten berkualitas—mudah dipahami, relevan, dan menginspirasi—agar siapa pun bisa tumbuh bersama teknologi dengan cara yang santai namun efektif.
                </p>
              </div>

            </div>
          </div>
        </section>
        {/* TENTANG SECTION END */}


        </HomeLayout>
    </>
  );
}