'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Search, Moon, Sun, Menu } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import Input from "@/components/ui/input"
import { useTheme } from 'next-themes'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SummaryData {
  summary: string;
}

const menuItems = [
  { name: 'Notícias', href: '/' },
  { name: 'Posts Bluesky', href: '/posts' },
  { name: 'Oportunidades', href: '/opportunity' }
]

function Summary() {
  const [subtopics, setSubtopics] = useState<{ title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://clientgemini.onrender.com/summarize_posts');
        const data: SummaryData = await response.json();

        const subtopics = data.summary.split('**').reduce((acc, curr, index, array) => {
          if (index % 2 !== 0) {
            acc.push({ title: curr.trim(), content: array[index + 1]?.trim() || '' });
          }
          return acc;
        }, [] as { title: string; content: string }[]);

        setSubtopics(subtopics);
      } catch (error) {
        console.error('Erro ao buscar resumo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <section className="p-4 sm:p-6 rounded-lg">
      {loading ? (
        <Skeleton className="h-20 w-full mb-4" />
      ) : (
        subtopics.map((subtopic, index) => (
          <div key={index} className="mb-6 sm:mb-8">
            <h3 className="font-semibold text-foreground mb-2 text-lg sm:text-xl">{subtopic.title}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{subtopic.content}</p>
          </div>
        ))
      )}
    </section>
  );
}

export default function Component() {

  const [searchTerm, setSearchTerm] = useState('')
  const [searchVisible, setSearchVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab] = useState('news')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleBlur = () => {
    setSearchVisible(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-serif transition-colors duration-200">
      <header className="bg-background border-b border-border p-3 sm:p-4 shadow-sm sticky top-0 z-10 transition-colors duration-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden mr-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-lg font-medium ${
                        pathname === item.href ? 'text-primary' : 'text-foreground'
                      } hover:text-primary transition-colors`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              
              </SheetContent>
            </Sheet>
            <Link href="/" className="text-2xl sm:text-3xl font-bold flex items-center mr-4 sm:mr-8">
              <span className="text-foreground">Milho News</span>
            </Link>
          </div>
          <nav className="hidden sm:flex items-center space-x-6"> {}
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium ${
                  activeTab === item.name.toLowerCase() ? 'text-primary' : 'text-foreground'
                } hover:text-primary transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleSearch}
            >
              <Search className="h-6 w-6" />
            </Button>
            <div className="relative hidden sm:block w-full sm:w-64">
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2 text-sm border-input focus:border-primary focus:ring-primary rounded-full"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
        {searchVisible && (
          <div className="container mx-auto mt-2 sm:hidden">
            <div className="relative">
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2 text-sm border-input focus:border-primary focus:ring-primary rounded-full"
                value={searchTerm}
                onChange={handleSearch}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBlur();
                  }
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex justify-center">
        <div className="w-full max-w-3xl">
          {Summary()}
        </div>
      </main>

      <footer className="bg-background text-muted-foreground py-6 sm:py-8 border-t border-border mt-6 sm:mt-8 transition-colors duration-200">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Sobre o Milho News</h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                Milho News é o seu site diário de notícias e atualizações do mundo do desenvolvimento de software. Aqui, você encontra os posts mais relevantes do Bluesky, com tudo que envolve TI: novidades, tendências e discussões que agitam a comunidade tech.
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground"></h3>
              <ul className="space-y-2">
                <li><Link href="https://github.com/MarlonJerold/milhonewsfront" className="hover:text-foreground text-xs sm:text-sm">Github</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Milho News. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}