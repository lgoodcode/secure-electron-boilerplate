import { render } from '@testing-library/react'
import './mocks/electronMock'
import App from '../renderer/App'

describe('App', () => {
	it('should render', () => {
		expect(render(<App />)).toBeTruthy()
	})
})
