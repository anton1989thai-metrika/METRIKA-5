export type ContractTemplate = {
  id: string
  name: string
  category: string
  fields: Array<{
    key: string
    label: string
    type: string
    required: boolean
  }>
  template: string
}
