import { useEffect, useState } from 'react'
import { Button, Flex, Progress, App } from 'antd'
import React from 'react'

// Доступно новое обновление 1.0.3 -> скачать, позже
// loading -> Загрузка обновление
// Обновление скачано -> установить, позже

function DisplayLoading(): JSX.Element {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    window.update.onDownloadProgress((value) => {
      setPercent(Math.round(value))
    })
  }, [])

  return <Progress percent={percent} size="small" />
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Context {}

export const ElectronUpdaterContext = React.createContext<Context>({
  // client: undefined,
  // disconnect: () => {},
})

interface Props {
  children: JSX.Element
}

function ElectronUpdaterProvider({ children }: Props): JSX.Element {
  const { notification } = App.useApp()

  useEffect(() => {
    window.update.onUpdateAvailable((_value) => {
      openAvailableUpdate(true, '1.0.4')
    })

    window.update.onUpdateDownloaded((_value) => {
      openDownloaded(true, '1.0.4')
    })
  }, [])

  const openAvailableUpdate = (pauseOnHover: boolean, version: string): void => {
    notification.info({
      message: 'Обновление программы!',
      description: (
        <>
          {`Доступно новое обновление ${version}!`}

          <Flex gap="small" wrap justify="end">
            <Button
              onClick={() => {
                window.update.downloadUpdate()
                openDownloadProgress(true)
              }}
              size="small"
              color="default"
              variant="text"
            >
              Скачать
            </Button>
          </Flex>
        </>
      ),
      showProgress: true,
      pauseOnHover
    })
  }

  const openDownloadProgress = (_pauseOnHover: boolean): void => {
    notification.open({
      message: 'Загрузка обновления!',
      description: <DisplayLoading />,
      duration: 0
    })
  }

  const openDownloaded = (pauseOnHover: boolean, version: string): void => {
    notification.success({
      message: 'Загрузка завершена!',
      description: (
        <>
          {`Установить обновление ${version}?`}

          <Flex gap="small" wrap justify="end">
            <Button
              onClick={() => {
                window.update.installUpdate()
              }}
              size="small"
              color="default"
              variant="text"
            >
              Да
            </Button>
          </Flex>
        </>
      ),
      pauseOnHover,
      showProgress: true
    })
  }

  return <ElectronUpdaterContext.Provider value={{}}>{children}</ElectronUpdaterContext.Provider>
}

export default ElectronUpdaterProvider
