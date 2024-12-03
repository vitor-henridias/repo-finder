import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import * as S from './styles'

export default function Repositorio() {
  const { repositorio } = useParams()

  const [repositorioObj, setRepositorioObj] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([
    { state: 'all', label: 'Todas', active: true },
    { state: 'open', label: 'Abertas', active: false },
    { state: 'closed', label: 'Fechadas', active: false },
  ])
  const [filterIndex, setFilterIndex] = useState(0)

  useEffect(() => {
    async function getRepo() {
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params: {
            state: filters.find((f) => f.active).state,
            per_page: 5,
          },
        }),
      ])

      setRepositorioObj(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    getRepo()
  }, [repositorio])

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`/repos/${repositorio}/issues`, {
        params: {
          state: filters[filterIndex].state,
          per_page: 5,
          page,
        },
      })

      setIssues(response.data)
    }

    loadIssue()
  }, [filters, filterIndex, repositorio, page])

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  function handleFilter(index) {
    setFilterIndex(index)

    const newFilters = filters.map((filter, i) => {
      filter.active = i === index
      return filter
    })

    setFilters(newFilters)
  }

  if (loading) {
    return (
      <S.Loading>
        <h1>Carregando...</h1>
      </S.Loading>
    )
  }

  return (
    <S.Container>
      <S.BackButton to="/">
        <FaArrowLeft color="#000" size={20} />
      </S.BackButton>

      <S.Owner>
        <img src={repositorioObj.owner.avatar_url} alt={repositorio} />
        <h1>{repositorioObj.name}</h1>
        <p>{repositorioObj.description}</p>
      </S.Owner>

      <S.FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button type="button" key={filter.label} onClick={() => handleFilter(index)}>
            {filter.label}
          </button>
        ))}
      </S.FilterList>

      <S.IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url} target="_blank">
                  {issue.title}
                </a>
                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </S.IssuesList>

      <S.PageActions>
        <button
          type="button"
          onClick={() => {
            handlePage('back')
          }}
          disabled={page < 2}
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          type="button"
          onClick={() => {
            handlePage('next')
          }}
        >
          Próxima
        </button>
      </S.PageActions>
    </S.Container>
  )
}
