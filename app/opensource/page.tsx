'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Heart, Share2, Search, Moon, Sun, Menu } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import Input from "@/components/ui/input"
import { useTheme } from 'next-themes'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Author {
  did: string;
  handle: string;
  displayName: string;
  avatar: string;
}

interface NewsPost {
  uri: string;
  cid: string;
  author: Author;
  record: {
    createdAt: string;
    text: string;
  };
  replyCount: number;
  repostCount: number;
  likeCount: number;
  indexedAt: string;
}

const menuItems = [
  { name: 'Notícias', href: '/' },
  { name: 'Posts Bluesky', href: '/posts' },
  { name: 'Milho IA', href: '/mensagem' },
  { name: 'Oportunidades', href: '/opportunity' },
  { name: 'Open Source', href: '/opensource' }
]


function NewsPost({ author, record, replyCount, repostCount, likeCount, uri }: NewsPost) {
    const id = uri.split('/').pop()
    const url = `https://bsky.app/profile/${author.handle}/post/${id}`
    const profileUrl = `https://bsky.app/profile/${author.handle}`
  
    return (
      <Card className="mb-0 bg-background border-border shadow-sm transition-colors duration-200 rounded-none">
        <CardContent className="pt-4 px-3 sm:pt-6 sm:px-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-border flex-shrink-0">
              <Link href={profileUrl} className="cursor-pointer">
                <AvatarImage src={author.avatar} alt={author.displayName} />
                <AvatarFallback>{author.displayName[0]}</AvatarFallback>
              </Link>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-foreground text-base sm:text-lg truncate">
                  {author.displayName}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm truncate">@{author.handle}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {new Date(record.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-foreground text-sm sm:text-base leading-relaxed">
                {record.text}
              </p>
              <div className="flex justify-between mt-4 text-muted-foreground">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 hover:text-foreground p-1 sm:p-2"
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} />
                    <span className="text-xs sm:text-sm">{replyCount}</span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 hover:text-foreground p-1 sm:p-2"
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Heart size={16} />
                    <span className="text-xs sm:text-sm">{likeCount}</span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 hover:text-foreground p-1 sm:p-2"
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Share2 size={16} />
                    <span className="text-xs sm:text-sm">{repostCount}</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  function NewsPostSkeleton() {
    return (
      <Card className="mb-0 border shadow-sm rounded-none">
        <CardContent className="pt-4 px-3 sm:pt-6 sm:px-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 sm:h-5 w-[150px] sm:w-[200px]" />
              <Skeleton className="h-3 sm:h-4 w-[100px] sm:w-[150px]" />
              <Skeleton className="h-3 sm:h-4 w-[80px] sm:w-[100px]" />
              <Skeleton className="h-16 sm:h-20 w-full" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
export default function PostsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchVisible, setSearchVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) 
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('https://milharal-news.onrender.com/post/github')
      const data = await response.json()
      if (Array.isArray(data)) {
        setPosts(data)
        setFilteredPosts(data)
      } else {
        console.error('Fetched data is not an array:', data)
        setPosts([])
        setFilteredPosts([])
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
      setPosts([])
      setFilteredPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    if (Array.isArray(posts)) {
      const filtered = posts.filter(post =>
        post.record.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.handle.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPosts(filtered)
    }
  }, [searchTerm, posts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const toggleSearch = () => {
    setSearchVisible(!searchVisible)
    if (!searchVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const handleBlur = () => {
    setSearchVisible(false)
  }

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
                      onClick={() => {
                        setIsMenuOpen(false)
                      }}
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
          <nav className="hidden sm:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href ? 'text-primary' : 'text-foreground'
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
                    handleBlur()
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

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">

            {loading ? (
              <>
                <NewsPostSkeleton />
                <NewsPostSkeleton />
                <NewsPostSkeleton />
              </>
            ) : (
              Array.isArray(filteredPosts) && filteredPosts.map(post => (
                <NewsPost key={post.cid} {...post} />
              ))
            )}
          </div>
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