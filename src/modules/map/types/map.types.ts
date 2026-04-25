import { Place } from "@/shared/types/types"

export type SearchResultsProps = {
  isFetching: boolean
  isError: boolean
  places: Place[]
  search: string
  activeInput: 'start' | 'end' | null
  handleSelectPlace: (place: Place) => void
}

export type DirectionModeInputsProps = {
  toggleDirectionMode: () => void
  search: string
  setSearch: (value: string) => void
}

export type SearchModeInputProps = {
  toggleDirectionMode: () => void
  search: string
  setSearch: (value: string) => void
}