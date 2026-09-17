import Link from "next/link";
import { projectReferences, type ProjectReference } from "@/data/services";

const categoryClass = (category: ProjectReference["category"]) =>
  category === "IT" ? "cat-IT" : category === "Design" ? "cat-Design" : "cat-mixed";

export default function ProjectReferencesPage() {
  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="logo" href="/">
            4YouTech
          </Link>
          <Link className="btn btn-accent" href="/#catalog">
            Về dịch vụ
          </Link>
        </div>
      </header>

      <main>
        <section className="references-intro">
          <div className="wrap">
            <p className="hero-kicker">4YouTech / Dự án mẫu</p>
            <h1>Tham khảo các dự án mẫu</h1>
            <p>
              Khám phá một số sản phẩm IT và Design để tìm cảm hứng cho ý tưởng và biến chúng thành hiện thực.
            </p>
          </div>
        </section>

        <section className="references">
          <div className="wrap">
            <div className="references-grid">
              {projectReferences.map((project) => (
                <article className="reference-card" key={project.id}>
                  <div className="reference-image">
                    <img src={project.image} alt={`${project.name} — dự án mẫu`} loading="lazy" />
                  </div>
                  <div className="reference-body">
                    <span className={`reference-category ${categoryClass(project.category)}`}>
                      {project.category}
                    </span>
                    <h2>{project.name}</h2>
                    {project.link ? (
                      <a
                        className="reference-link"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Xem dự án <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="reference-link reference-link-disabled">Dự án tham khảo</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">4YouTech — dịch vụ IT &amp; Design theo yêu cầu.</div>
      </footer>
    </>
  );
}
