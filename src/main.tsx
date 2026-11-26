import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Boxes,
  Braces,
  Code2,
  Command,
  Database,
  Globe2,
  Grid2X2,
  Menu,
  Moon,
  Search,
  Sun,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import catalog from "./catalog.json";
import "./style.css";

type Topic = (typeof catalog)[number];
type Entry = {
  name: string;
  url: string | null;
  note?: boolean;
  unavailable?: boolean;
};
type Group = { title: string; section: string; links: Entry[] };
const categories = [
  {
    name: "Languages",
    icon: Code2,
    slugs:
      "javascript python java php ruby c csharp cpp rust go scala perl r swift kotlin haskell clojure lisp lua ocaml ada erlang fortran assembly fsharp objective-c visualbasic actionscript windows-powershell shellscript sed awk",
  },
  {
    name: "Web Development",
    icon: Globe2,
    slugs:
      "html css html-dom jquery nodejs express ajax xhtml svg webgl http xml xpath xslt mod_rewrite emmet less prototype mootools django drupal wordpress laravel symfony rubyrails spring jsf javaee play-framework grails",
  },
  {
    name: "Databases",
    icon: Database,
    slugs:
      "mysql sql postgresql sqlite sqlserver oracle mongodb mongo-shell apache-cassandra db2 db4o berkeley-db hbase sybase ado-net jdbc",
  },
  {
    name: "Tools & DevOps",
    icon: Terminal,
    slugs:
      "git svn linux docker ubuntu debian apt rpm fedora vim vi emacs gdb cmake maven apache-ant apache chef azure openvz openssh netbeans eclipse intellij-idea phpstorm terraform windows screen tcpdump",
  },
];
const featured = [
  {
    slug: "javascript",
    name: "JavaScript",
    mark: "JS",
    color: "yellow",
    description: "Core objects, arrays, strings, and browser APIs.",
  },
  {
    slug: "python",
    name: "Python",
    mark: "Py",
    color: "blue",
    description: "Built-in types, functions, modules, and file handling.",
  },
  {
    slug: "git",
    name: "Git",
    mark: "git",
    color: "orange",
    description: "Everyday commands for commits, branches, and remotes.",
  },
  {
    slug: "html",
    name: "HTML",
    mark: "<>",
    color: "orange",
    description: "Elements, attributes, forms, and document structure.",
  },
  {
    slug: "css",
    name: "CSS",
    mark: "#",
    color: "blue",
    description: "Selectors, layout, typography, and styling properties.",
  },
  {
    slug: "linux",
    name: "Linux",
    mark: ">_",
    color: "purple",
    description: "Shell commands for files, permissions, and processes.",
  },
  {
    slug: "nodejs",
    name: "Node.js",
    mark: "N",
    color: "green",
    description: "Modules, streams, events, and server-side APIs.",
  },
  {
    slug: "mysql",
    name: "MySQL",
    mark: "SQL",
    color: "blue",
    description: "Queries, data types, joins, and database administration.",
  },
  {
    slug: "java",
    name: "Java",
    mark: "Ja",
    color: "orange",
    description: "Classes, collections, exceptions, and the standard library.",
  },
];
const toolsTopic = {
  name: "Developer tools",
  slug: "developer-tools",
  letter: "D",
};
const library = [...catalog, toolsTopic];
const sheets = [
  ...new Map(
    library
      .slice()
      .reverse()
      .map((topic) => [topic.slug, topic]),
  ).values(),
].sort((left, right) =>
  left.name.localeCompare(right.name, "en", { numeric: true }),
);
const homeUrl = import.meta.env.BASE_URL;
const topicUrl = (topic: Pick<Topic, "slug">) =>
  homeUrl + "sheet/" + encodeURIComponent(topic.slug) + "/";
function categoryOf(slug: string) {
  return (
    categories.find((category) => category.slugs.split(" ").includes(slug))
      ?.name ?? "Other"
  );
}
function readSaved() {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("devsheets:saved") ?? "[]",
    );
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}
function getRoute() {
  const { hash, pathname } = window.location;
  if (hash.startsWith("#/")) return hash.slice(1);
  return ("/" + pathname.slice(homeUrl.length)).replace(/\/$/, "") || "/";
}
function App() {
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("");
  const [saved, setSaved] = useState(readSaved);
  const [light, setLight] = useState(
    () => localStorage.getItem("devsheets:theme") === "light",
  );
  const search = useRef<HTMLInputElement>(null);
  const catalogSection = useRef<HTMLElement>(null);
  const activeCategory = categories.find(
    (category) => route === "/category/" + encodeURIComponent(category.name),
  );
  const savedView = route === "/saved";
  const sheetSlug = route.startsWith("/sheet/") ? route.slice(7) : "";
  const topic =
    sheetSlug === toolsTopic.slug
      ? toolsTopic
      : catalog.find((item) => encodeURIComponent(item.slug) === sheetSlug);
  const isHome = route === "/";
  const pageName = topic ? topic.name + " cheat sheet" : activeCategory?.name ??
    (savedView ? "Saved sheets" : "Developer cheat sheets");
  const filtered = (
    savedView
      ? library.filter(
          (item, index, items) =>
            items.findIndex((other) => other.slug === item.slug) === index,
        )
      : library
  ).filter(
    (item) =>
      (!savedView || saved.includes(item.slug)) &&
      (!activeCategory || categoryOf(item.slug) === activeCategory.name) &&
      (!letter || letter === item.letter) &&
      (!query.trim() ||
        [item.name, item.slug].some((value) =>
          value.toLowerCase().includes(query.trim().toLowerCase()),
        )),
  );
  const letters = [...new Set(catalog.map((item) => item.letter))];

  useEffect(() => {
    if (window.location.hash.startsWith("#/sheet/") && topic) {
      window.history.replaceState(null, "", topicUrl(topic));
    }
    document.title = topic ? pageName + " | DevSheets" : "DevSheets — " + pageName;
  }, [topic, pageName]);
  useEffect(() => {
    const update = () => {
      setRoute(getRoute());
      setMenuOpen(false);
      setQuery("");
      setLetter("");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  useEffect(() => {
    localStorage.setItem("devsheets:saved", JSON.stringify(saved));
  }, [saved]);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    localStorage.setItem("devsheets:theme", light ? "light" : "dark");
  }, [light]);
  const toggleSaved = (slug: string) =>
    setSaved((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  const browse = () =>
    catalogSection.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href={homeUrl}>
          <span className="brand-icon">
            <Braces size={22} />
          </span>
          <span>
            DevSheets<small>DEVELOPER REFERENCE</small>
          </span>
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="library-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />} Menu
        </button>
        <nav
          id="library-navigation"
          className={menuOpen ? "menu-open" : ""}
          aria-label="Main navigation"
        >
          <p className="nav-label">LIBRARY</p>
          <a className={isHome ? "active" : ""} href={homeUrl}>
            <Grid2X2 size={17} /> Explore{" "}
            <span className="nav-count">{library.length}</span>
          </a>
          <a className={savedView ? "active" : ""} href={homeUrl + "#/saved"}>
            <Bookmark size={17} /> Saved sheets{" "}
            {saved.length > 0 && (
              <span className="nav-count">{saved.length}</span>
            )}
          </a>
          <p className="nav-label category-label">CATEGORIES</p>
          {categories.map(({ name, icon: Icon }) => (
            <a
              key={name}
              className={activeCategory?.name === name ? "active" : ""}
              href={homeUrl + "#/category/" + encodeURIComponent(name)}
            >
              <Icon size={17} />
              {name}
            </a>
          ))}
          <a
            className={topic?.slug === toolsTopic.slug ? "active" : ""}
            href={topicUrl(toolsTopic)}
          >
            <Wrench size={17} />
            Developer tools
          </a>
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <span className="breadcrumb">
            <BookOpen size={16} /> Library <span>/</span>{" "}
            <strong>
              {topic?.name ??
                activeCategory?.name ??
                (savedView ? "Saved sheets" : "Explore")}
            </strong>
          </span>
          <Button
            variant="ghost"
            aria-label={
              light ? "Switch to dark theme" : "Switch to light theme"
            }
            onClick={() => setLight(!light)}
          >
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        </header>
        <div className="content">
          {topic ? (
            <Reference
              key={topic.slug}
              topic={topic}
              saved={saved.includes(topic.slug)}
              onSave={() => toggleSaved(topic.slug)}
              search={search}
            />
          ) : (
            <>
              {isHome ? (
                <section className="hero">
                  <div className="hero-copy">
                    <p className="eyebrow">
                      <span /> THE DEVELOPER REFERENCE LIBRARY
                    </p>
                    <h1>
                      Cheat sheets for
                      <br />
                      <em>everything you build.</em>
                    </h1>
                    <p className="hero-description">
                      Find quick references for the languages, frameworks, and
                      tools you use every day.
                    </p>
                    <SearchBox
                      value={query}
                      onChange={(value) => {
                        setQuery(value);
                        setLetter("");
                      }}
                      inputRef={search}
                      placeholder="Search cheat sheets…"
                    />
                    <div className="hero-meta">
                      <span>
                        <Boxes size={15} /> {library.length} index entries
                      </span>
                      <button onClick={browse}>
                        Browse A–Z <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="hero-art" aria-hidden="true">
                    <div className="terminal-art">
                      <div className="terminal-top">
                        <i />
                        <i />
                        <i />
                        <span>quick-reference.ts</span>
                      </div>
                      <div className="terminal-code">
                        <div>
                          <b>01</b>
                          <span>
                            <i>const</i> toolkit = &#123;
                          </span>
                        </div>
                        <div>
                          <b>02</b>
                          <span>
                            {" "}
                            language: <em>'JavaScript'</em>,
                          </span>
                        </div>
                        <div>
                          <b>03</b>
                          <span>
                            {" "}
                            tools: [<em>'Git'</em>, <em>'Linux'</em>],
                          </span>
                        </div>
                        <div>
                          <b>04</b>
                          <span>
                            {" "}
                            database: <em>'MySQL'</em>
                          </span>
                        </div>
                        <div>
                          <b>05</b>
                          <span>&#125;</span>
                        </div>
                      </div>
                      <div className="terminal-footer">
                        <span>✦</span> Developer reference
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="page-intro">
                  <p className="eyebrow">DEVELOPER LIBRARY</p>
                  <h1>
                    {activeCategory?.name ??
                      (savedView ? "Saved sheets" : "Explore cheat sheets")}
                  </h1>
                  <SearchBox
                    value={query}
                    onChange={setQuery}
                    inputRef={search}
                    placeholder="Filter cheat sheets…"
                  />
                </section>
              )}
              {isHome && !query.trim() && !letter && (
                <section className="featured">
                  <div className="section-heading">
                    <div>
                      <h2>Popular cheat sheets</h2>
                      <p>Quick access to everyday developer references.</p>
                    </div>
                    <Button variant="outline" onClick={browse}>
                      View all <ArrowRight size={15} />
                    </Button>
                  </div>
                  <div className="card-grid">
                    {featured.map((item) => {
                      const entry = catalog.find(
                        (topic) => topic.slug === item.slug,
                      );
                      if (!entry) return null;
                      return (
                        <article className="topic-card" key={item.slug}>
                          <div className="card-top">
                            <span className={"tech-icon " + item.color}>
                              {item.mark}
                            </span>
                            <Button
                              variant="ghost"
                              aria-label={
                                (saved.includes(item.slug)
                                  ? "Unsave "
                                  : "Save ") + item.name
                              }
                              aria-pressed={saved.includes(item.slug)}
                              onClick={() => toggleSaved(item.slug)}
                            >
                              <Bookmark
                                size={18}
                                fill={
                                  saved.includes(item.slug)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </Button>
                          </div>
                          <a className="card-link" href={topicUrl(entry)}>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <span>
                              {categoryOf(item.slug)} <ArrowUpRight size={16} />
                            </span>
                          </a>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
              <section ref={catalogSection} className="catalog">
                <div className="section-heading">
                  <div>
                    <h2>
                      {query.trim()
                        ? "Search results"
                        : savedView
                          ? "Your collection"
                          : "Browse the index"}
                    </h2>
                    <p>
                      {filtered.length}{" "}
                      {filtered.length === 1 ? "topic" : "topics"}
                    </p>
                  </div>
                </div>
                {!savedView && (
                  <div className="alphabet" aria-label="Filter by letter">
                    {["", ...letters].map((value) => (
                      <button
                        key={value}
                        className={value === letter ? "selected" : ""}
                        aria-pressed={value === letter}
                        onClick={() => setLetter(value)}
                      >
                        {value || "All"}
                      </button>
                    ))}
                  </div>
                )}
                {filtered.length ? (
                  <div className="index-grid">
                    {filtered.map((item) => (
                      <div
                        className="index-row"
                        key={item.letter + ":" + item.name + ":" + item.slug}
                      >
                        <a href={topicUrl(item)}>
                          <span>{item.name}</span>
                          <ArrowUpRight size={14} />
                        </a>
                        <Button
                          variant="ghost"
                          aria-label={
                            (saved.includes(item.slug) ? "Unsave " : "Save ") +
                            item.name
                          }
                          aria-pressed={saved.includes(item.slug)}
                          onClick={() => toggleSaved(item.slug)}
                        >
                          <Bookmark
                            size={15}
                            fill={
                              saved.includes(item.slug)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty">
                    {savedView && !query
                      ? "Save a cheat sheet using its bookmark button to find it here."
                      : "No cheat sheets match your search."}
                  </p>
                )}
              </section>
            </>
          )}
          <footer className="footer">DevSheets</footer>
        </div>
      </main>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  inputRef,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.Ref<HTMLInputElement>;
  placeholder: string;
}) {
  return (
    <div className="search-box">
      <Search size={19} />
      <input
        ref={inputRef}
        aria-label={placeholder.replace("…", "")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value ? (
        <Button
          variant="ghost"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={16} />
        </Button>
      ) : (
        <kbd>
          <Command size={12} /> K
        </kbd>
      )}
    </div>
  );
}

function Reference({
  topic,
  saved,
  onSave,
  search,
}: {
  topic: Topic;
  saved: boolean;
  onSave: () => void;
  search: React.Ref<HTMLInputElement>;
}) {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(homeUrl + "references/" + encodeURIComponent(topic.slug) + ".json", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Reference request failed");
        return response.json();
      })
      .then((data: Group[]) => setGroups(data))
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [topic.slug]);
  const sheetIndex = sheets.findIndex((sheet) => sheet.slug === topic.slug);
  const previousSheet = sheets[sheetIndex - 1];
  const nextSheet = sheets[sheetIndex + 1];
  const term = query.trim().toLowerCase();
  const results = (groups ?? [])
    .map((group, id) => {
      const rows: Entry[][] = [];
      for (const entry of group.links) {
        const previous = rows.at(-1);
        const lead = previous?.[0];
        if (
          entry.note &&
          !entry.url &&
          lead &&
          !lead.note &&
          !lead.url &&
          !lead.unavailable
        ) {
          previous.push(entry);
        } else {
          rows.push([entry]);
        }
      }
      const matchesHeading = [group.title, group.section].some((value) =>
        value.toLowerCase().includes(term),
      );
      return {
        ...group,
        id,
        rows: rows.filter(
          (row) =>
            matchesHeading ||
            row.some((entry) => entry.name.toLowerCase().includes(term)),
        ),
      };
    })
    .filter((group) => group.rows.length);
  return (
    <section className="reference">
      <a className="back" href={homeUrl}>
        <ArrowLeft size={16} /> Explore library
      </a>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{categoryOf(topic.slug)}</p>
          <h1>{topic.name}</h1>
        </div>
        <Button variant="outline" aria-pressed={saved} onClick={onSave}>
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save sheet"}
        </Button>
      </div>
      {failed ? (
        <p className="empty" role="alert">
          This sheet could not be loaded. Refresh to try again.
        </p>
      ) : groups === null ? (
        <p className="empty" role="status">
          Loading reference…
        </p>
      ) : groups.length === 0 ? (
        <p className="empty">No entries are available for this sheet yet.</p>
      ) : (
        <>
          <SearchBox
            value={query}
            onChange={setQuery}
            inputRef={search}
            placeholder="Find a command, method, or resource…"
          />
          {term && (
            <p className="reference-results" role="status">
              {results.length
                ? `${results.length} matching ${results.length === 1 ? "card" : "cards"}`
                : "No entries match your search."}
            </p>
          )}
          <div className="reference-grid">
            {results.map((group) => (
              <article className="reference-card" key={group.id}>
                <header>
                  {group.section && group.section !== group.title && (
                    <p className="eyebrow">{group.section}</p>
                  )}
                  <h2>{group.title}</h2>
                </header>
                <ul className="reference-entries">
                  {group.rows.map((row, index) => (
                    <li key={index}>
                      {row.map((entry, entryIndex) =>
                        entry.url ? (
                          <a
                            key={entryIndex}
                            href={entry.url.startsWith("#/sheet/") ? homeUrl + entry.url.slice(2) + "/" : entry.url}
                            target={
                              entry.url.startsWith("#") ? undefined : "_blank"
                            }
                            rel="noreferrer"
                          >
                            <span>{entry.name}</span>
                            {entry.url.startsWith("#") ? (
                              <ArrowRight size={14} />
                            ) : (
                              <ArrowUpRight size={14} />
                            )}
                          </a>
                        ) : entry.note || entry.unavailable ? (
                          <p className="reference-note" key={entryIndex}>
                            {entry.name}
                            {entry.unavailable && (
                              <small className="unavailable">
                                Download unavailable
                              </small>
                            )}
                          </p>
                        ) : (
                          <code className="reference-token" key={entryIndex}>
                            {entry.name}
                          </code>
                        ),
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      )}
      <nav className="sheet-navigation" aria-label="Cheat sheet navigation">
        {previousSheet && (
          <a
            className="sheet-navigation-link"
            href={topicUrl(previousSheet)}
            rel="prev"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span>
              <small>Previous sheet</small>
              <strong>{previousSheet.name}</strong>
            </span>
          </a>
        )}
        {nextSheet && (
          <a
            className="sheet-navigation-link sheet-navigation-next"
            href={topicUrl(nextSheet)}
            rel="next"
          >
            <span>
              <small>Next sheet</small>
              <strong>{nextSheet.name}</strong>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        )}
      </nav>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
