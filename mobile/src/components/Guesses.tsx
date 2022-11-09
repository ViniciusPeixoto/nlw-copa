import { useEffect, useState } from 'react'
import { Box, FlatList, useToast } from 'native-base';

import { api } from '../services/api'
import { Game, GameProps } from '../components/Game'
import { Loading } from '../components/Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [homeTeamPoints, setHomeTeamPoints] = useState('')
  const [visitorTeamPoints, setVisitorTeamPoints] = useState('')


  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)
    } catch (err) {
      console.log(err)
      toast.show({
        title: 'Não foi possível carregar os jogos!',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!homeTeamPoints.trim() || !visitorTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite!',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        homeTeamPoints: Number(homeTeamPoints),
        visitorTeamPoints: Number(visitorTeamPoints),
      })

      toast.show({
        title: 'Palpite enviado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })

      fetchGames()
    } catch (err) {
      console.log(err)
      toast.show({
        title: 'Não foi possível enviar o palpite!',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if(isLoading){
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setHomeTeamPoints={setHomeTeamPoints}
          setVisitorTeamPoints={setVisitorTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
