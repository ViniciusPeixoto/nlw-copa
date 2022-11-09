import { Button, HStack, Text, useTheme, VStack } from 'native-base';
import { X, Check } from 'phosphor-react-native';
import { getName } from 'country-list'
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br'

import { Team } from './Team';

interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  homeTeamPoints: number;
  visitorTeamPoints: number;
}

export interface GameProps {
  id: string;
  date: string;
  homeTeamCountryCode: string;
  visitorTeamCountryCode: string;
  guess: null | GuessProps;
};

interface Props {
  data: GameProps;
  onGuessConfirm: () => void;
  setHomeTeamPoints: (value: string) => void;
  setVisitorTeamPoints: (value: string) => void;
};

export function Game({ data, setHomeTeamPoints, setVisitorTeamPoints, onGuessConfirm }: Props) {
  const { colors, sizes } = useTheme();
  const when = dayjs(data.date).locale(ptBR).format("DD [de] MMMM [de] YYYY [às] HH:00[h]")

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.homeTeamCountryCode)} vs. {getName(data.visitorTeamCountryCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {when}
      </Text>

      <HStack mt={4} w="full" justifyContent="space-between" alignItems="center">
        <Team
          code={data.homeTeamCountryCode}
          position="right"
          onChangeText={setHomeTeamPoints}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.visitorTeamCountryCode}
          position="left"
          onChangeText={setVisitorTeamPoints}
        />
      </HStack>

      {
        !data.guess &&
        <Button size="xs" w="full" bgColor="green.500" mt={4} onPress={onGuessConfirm}>
          <HStack alignItems="center">
            <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
              CONFIRMAR PALPITE
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      }
    </VStack>
  );
}