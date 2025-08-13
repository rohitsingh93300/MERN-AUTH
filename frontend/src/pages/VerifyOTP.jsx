import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const VerifyOTP = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])
  const { email } = useParams()
  const navigate = useNavigate()


  const handleChange = (index, value) => {
    if (value.length > 1) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const finalOtp = otp.join("")
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/user/verify-otp/${email}`, {
        otp: finalOtp,
      })
      setSuccessMessage(res.data.message)
      setTimeout(() => {
        navigate(`/change-password/${email}`)
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  return (
    <div className='min-h-screen flex flex-col bg-green-100'>
      {/* Main content */}
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Verfiy your email</h1>
            <p className='text-muted-foreground'>We've sent a 6-digit verification code to{" "}
              <span>{"your email"}</span>
            </p>
          </div>
          <Card className='shadow-lg'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl text-center text-green-600'>Enter verification code</CardTitle>
              <CardDescription className='text-center'>
                {
                  isVerified
                    ? "Code verified successfully! Redirecting..."
                    :
                    "Enter the 6-digit code sent to your email"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {
                error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )
              }
              {successMessage && <p className='text-green-500 text-sm mb-3 text-center'>{successMessage}</p>}
              {
                isVerified ? (
                  <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                    <div className='bg-primary/10 rounded-full p-3'>
                      <CheckCircle className='h-6 w-6 text-primary' />
                    </div>
                    <div className='space-y-2'>
                      <h3 className='font-medium text-lg'>Verification successfull</h3>
                      <p className='text-muted-foreground'>Your email has been verified. you'll be redirected to reset your password</p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span className='text-sm text-muted-foreground'>Redirecting...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* OTP Input */}
                    <div className='flex justify-between mb-6'>
                      {
                        otp.map((digit, index) => (
                          <Input
                            key={index}
                            type="text"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            maxLength={1}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-xl font-bold"
                          />
                        ))
                      }
                    </div>
                    {/* Action Buttons */}
                    <div className='space-y-3'>
                      <Button
                        onClick={handleVerify}
                        disabled={isLoading || otp.some((digit) => digit === "")}
                        className='bg-green-600 w-full'>
                        {isLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Verifiying</> : "Verify code"}
                      </Button>
                      <Button variant='outline'
                        onClick={clearOtp}
                        className='w-full bg-transparent'
                        disabled={isLoading || isVerified}
                      >
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Clear
                      </Button>
                    </div>
                  </>
                )

              }
            </CardContent>
            <CardFooter className='flex justify-center'>
              <p className='text-sm text-muted-foreground'>
                Wrong email?{" "}
                <Link to={'/forgot-password'} className='text-green-600 hover:underline font-medium'>Go back</Link>
              </p>
            </CardFooter>
          </Card>
          <div className='text-center text-xs text-muted-foreground'>
            <p>
              Fot testing purposes, use code: <span className='font-mono font-medium'>123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP
