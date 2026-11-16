import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api.js'
import { useAuth } from '../App.jsx'
import FormField from '../components/FormField.jsx'
import Alert from '../components/Alert.jsx'
import GoogleLoginButton from '../components/GoogleLoginButton.jsx'
import FacebookLoginButton from '../components/FacebookLoginButton.jsx'

export default function Login() {
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')
  const [facebookError, setFacebookError] = useState('')

  return (
    <div className="auth-layout">
      <div className="auth-card">

        {/* Google Login */}
        <GoogleLoginButton
          onError={(msg) => setGoogleError(msg)}
          disabled={loading}
        />
        {googleError && <Alert type="info" style={{ marginTop: '0.75rem' }}>{googleError}</Alert>}

        {/* Facebook Login */}
        <FacebookLoginButton
          onError={(msg) => setFacebookError(msg)}
          disabled={loading}
        />
        {facebookError && <Alert type="info" style={{ marginTop: '0.75rem' }}>{facebookError}</Alert>}

        {apiError && <Alert type="error">{apiError}</Alert>}

      </div>
    </div>
  )
}
