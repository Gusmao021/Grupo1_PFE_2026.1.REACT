import { useState, useEffect } from 'react'
import { fetchCategories, fetchFeaturedPost, fetchPosts } from '../../services/acbApi'

export function usePosts() {
    const [categories, setCategories] = useState([])
    const [featured, setFeatured] = useState(null)
    const [posts, setPosts] = useState([])

    const [page, setPage] = useState(1)
    const [categoryId, setCategoryId] = useState(null)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')

    const [totalPages, setTotalPages] = useState(1)
    const [totalPosts, setTotalPosts] = useState(0)
    
    const [status, setStatus] = useState('loading') 

    const featuredId = featured?.id ?? null

    useEffect(() => {
        let cancel = false
        fetchCategories()
            .then(cats => { if (!cancel) setCategories(cats) })
            .catch(err => console.warn('Falha ao carregar categorias:', err))
        return () => { cancel = true }
    }, [])

    useEffect(() => {
        let cancel = false
        fetchFeaturedPost()
            .then(post => { if (!cancel && post) setFeatured(post) })
            .catch(err => console.warn('Falha ao carregar destaque:', err))
        return () => { cancel = true }
    }, [])

    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim())
            setPage(1)
            setStatus('loading') // <-- ADICIONADO AQUI
        }, 350)
        return () => clearTimeout(t)
    }, [searchInput])

    function handleSetPage(newPage) {
        setPage(newPage)
        setStatus('loading') // <-- ADICIONADO AQUI
    }

    function selectCategory(id) {
        setCategoryId(id)
        setPage(1)
        setStatus('loading') // <-- ADICIONADO AQUI
    }

    useEffect(() => {
        let cancel = false

        const excludeId = featuredId && page === 1 && !search && !categoryId ? featuredId : null

        fetchPosts({ page, categoryId, search, excludeId })
            .then(({ posts: data, totalPages: tp, totalPosts: tt }) => {
                if (cancel) return
                setPosts(data)
                setTotalPages(tp)
                setTotalPosts(tt)
                setStatus(data.length ? 'ok' : 'empty')
            })
            .catch(err => {
                if (cancel) return
                console.error(err)
                setStatus('error')
            })

        return () => { cancel = true }
    }, [page, categoryId, search, featuredId])

    const pageNumbers = (() => {
        const totalToShow = Math.min(totalPages, 5)
        let start = Math.max(1, page - 2)
        let end = Math.min(totalPages, start + totalToShow - 1)
        start = Math.max(1, end - totalToShow + 1)
        const arr = []
        for (let i = start; i <= end; i++) arr.push(i)
        return arr
    })()

    return {
        categories,
        featured,
        posts,
        page,
        setPage: handleSetPage, 
        categoryId,
        searchInput,
        setSearchInput,
        totalPages,
        totalPosts,
        status,
        selectCategory,
        pageNumbers,
    }
}