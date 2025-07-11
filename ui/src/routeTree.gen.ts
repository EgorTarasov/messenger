/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as LoginRouteImport } from './routes/login'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated'
import { Route as AuthenticatedMeRouteImport } from './routes/_authenticated/me'
import { Route as AuthenticatedHomeRouteImport } from './routes/_authenticated/home'
import { Route as AuthenticatedHomeIndexRouteImport } from './routes/_authenticated/home/index'
import { Route as AuthenticatedHomeChatIdRouteImport } from './routes/_authenticated/home/$chatId'

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthenticatedRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthenticatedMeRoute = AuthenticatedMeRouteImport.update({
  id: '/me',
  path: '/me',
  getParentRoute: () => AuthenticatedRoute,
} as any)
const AuthenticatedHomeRoute = AuthenticatedHomeRouteImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => AuthenticatedRoute,
} as any)
const AuthenticatedHomeIndexRoute = AuthenticatedHomeIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedHomeRoute,
} as any)
const AuthenticatedHomeChatIdRoute = AuthenticatedHomeChatIdRouteImport.update({
  id: '/$chatId',
  path: '/$chatId',
  getParentRoute: () => AuthenticatedHomeRoute,
} as any)

export interface FileRoutesByFullPath {
  '/login': typeof LoginRoute
  '/home': typeof AuthenticatedHomeRouteWithChildren
  '/me': typeof AuthenticatedMeRoute
  '/home/$chatId': typeof AuthenticatedHomeChatIdRoute
  '/home/': typeof AuthenticatedHomeIndexRoute
}
export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/me': typeof AuthenticatedMeRoute
  '/home/$chatId': typeof AuthenticatedHomeChatIdRoute
  '/home': typeof AuthenticatedHomeIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/login': typeof LoginRoute
  '/_authenticated/home': typeof AuthenticatedHomeRouteWithChildren
  '/_authenticated/me': typeof AuthenticatedMeRoute
  '/_authenticated/home/$chatId': typeof AuthenticatedHomeChatIdRoute
  '/_authenticated/home/': typeof AuthenticatedHomeIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/login' | '/home' | '/me' | '/home/$chatId' | '/home/'
  fileRoutesByTo: FileRoutesByTo
  to: '/login' | '/me' | '/home/$chatId' | '/home'
  id:
    | '__root__'
    | '/_authenticated'
    | '/login'
    | '/_authenticated/home'
    | '/_authenticated/me'
    | '/_authenticated/home/$chatId'
    | '/_authenticated/home/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  LoginRoute: typeof LoginRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated/me': {
      id: '/_authenticated/me'
      path: '/me'
      fullPath: '/me'
      preLoaderRoute: typeof AuthenticatedMeRouteImport
      parentRoute: typeof AuthenticatedRoute
    }
    '/_authenticated/home': {
      id: '/_authenticated/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof AuthenticatedHomeRouteImport
      parentRoute: typeof AuthenticatedRoute
    }
    '/_authenticated/home/': {
      id: '/_authenticated/home/'
      path: '/'
      fullPath: '/home/'
      preLoaderRoute: typeof AuthenticatedHomeIndexRouteImport
      parentRoute: typeof AuthenticatedHomeRoute
    }
    '/_authenticated/home/$chatId': {
      id: '/_authenticated/home/$chatId'
      path: '/$chatId'
      fullPath: '/home/$chatId'
      preLoaderRoute: typeof AuthenticatedHomeChatIdRouteImport
      parentRoute: typeof AuthenticatedHomeRoute
    }
  }
}

interface AuthenticatedHomeRouteChildren {
  AuthenticatedHomeChatIdRoute: typeof AuthenticatedHomeChatIdRoute
  AuthenticatedHomeIndexRoute: typeof AuthenticatedHomeIndexRoute
}

const AuthenticatedHomeRouteChildren: AuthenticatedHomeRouteChildren = {
  AuthenticatedHomeChatIdRoute: AuthenticatedHomeChatIdRoute,
  AuthenticatedHomeIndexRoute: AuthenticatedHomeIndexRoute,
}

const AuthenticatedHomeRouteWithChildren =
  AuthenticatedHomeRoute._addFileChildren(AuthenticatedHomeRouteChildren)

interface AuthenticatedRouteChildren {
  AuthenticatedHomeRoute: typeof AuthenticatedHomeRouteWithChildren
  AuthenticatedMeRoute: typeof AuthenticatedMeRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedHomeRoute: AuthenticatedHomeRouteWithChildren,
  AuthenticatedMeRoute: AuthenticatedMeRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute: LoginRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
