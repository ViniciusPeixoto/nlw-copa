import { Heading, useToast, VStack } from "native-base"

import { Header } from '../components/Header'
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { useState } from "react"
import { api } from "../services/api"
import { useNavigation } from "@react-navigation/native"


export function Find() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPool() {
    try{
      setIsLoading(true)
      if (!code.trim()) {
        return toast.show({
          title: 'Informe o código!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/pools/join', { code })
      navigate('pools')

    } catch(err) {
      console.log(err)
      setIsLoading(false)

      if (err.response?.data?.message === 'Pool not found!') {
        return toast.show({
          title: 'Não foi possivel encontrar o bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if (err.response?.data?.message === 'Already joined!') {
        return toast.show({
          title: 'Você já faz parte desse bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
  
      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
    }
  }
  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Buscar por código' showBackButton/>

      <VStack mt={8} mx={5} alignItems='center'>
        <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center'>
          Encontre um bolão através de{'\n'}seu código único
        </Heading>

        <Input
          mb={2}
          placeholder='Qual o código do seu bolão'
          autoCapitalize="characters"
          onChangeText={setCode}
        />

        <Button
          title='BUSCAR BOLÃO'
          isLoading={isLoading}
          onPress={handleJoinPool}
        />

      </VStack>
    </VStack>
  )
}