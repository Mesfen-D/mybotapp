import os
import logging
import json
from dotenv import load_dotenv
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, MenuButtonWebApp
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)
from telegram.request import HTTPXRequest

# Load environment variables strictly from .env file, overriding any system ones
load_dotenv(override=True)

# Set up logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# =====================================================================
# YOUR PRIVATE CHANNEL CHAT ID
# Example: CHANNEL_ID = -1002145678912
# =====================================================================
CHANNEL_ID = -1003820985534

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for the /start command. Shows welcome message and WebApp keyboards."""
    
    web_app_url = 'https://Mesfen-D.github.io/mybotapp/'
    
    # 1. Set the Menu Button (bottom left next to attachment icon)
    await context.bot.set_chat_menu_button(
        chat_id=update.effective_chat.id,
        menu_button=MenuButtonWebApp(text="🎨 ዲዛይን እዘዝ", web_app=WebAppInfo(url=web_app_url))
    )
    
    # 2. Regular Keyboard Button (Needed for sendData to work properly on all devices)
    keyboard = [
        [KeyboardButton("🎨 ዲዛይን እዘዝ (Keyboard)", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    # 3. Inline Keyboard Button (As requested, though sendData does not work from inline buttons)
    inline_keyboard = [
        [InlineKeyboardButton("🎨 ዲዛይን እዘዝ (Inline)", web_app=WebAppInfo(url=web_app_url))]
    ]
    inline_markup = InlineKeyboardMarkup(inline_keyboard)
    
    await update.message.reply_text(
        "እንኳን በደህና መጡ! ትዕዛዝዎን ለማስገባት ከታች ያለውን የኪቦርድ ቁልፍ ይጫኑ፡\n\n"
        "(ማሳሰቢያ፡ ቅጹን ሞልተው መረጃ መላክ የሚቻለው በ Keyboard ወይም በ Menu Button በኩል ሲከፈት ብቻ ነው።)",
        reply_markup=reply_markup
    )
    
    await update.message.reply_text(
        "ወይም ይህንን Inline ሊንክ በመጫን ይዘዙ:",
        reply_markup=inline_markup
    )

async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler to receive data from the WebApp form submission."""
    data = json.loads(update.effective_message.web_app_data.data)
    
    user = update.message.from_user
    username = f"@{user.username}" if user.username else f"{user.first_name}"
    
    service_type = data.get('type_name', 'ሌላ')
    
    # Extract incoming fields from the JavaScript JSON
    company_name = data.get('company_name', '')
    phone = data.get('contact', '') 
    color = data.get('colors', '')
    details = data.get('instructions', '')
    
    photos_b64 = data.get('photos', [])
    if 'photo' in data and not photos_b64:
        photos_b64 = [data['photo']]
    
    # Format beautiful order summary text using HTML formatting
    order_text = f"🎨 <b>አዲስ የንድፍ ትዕዛዝ: {service_type}</b>\n"
    order_text += f"━━━━━━━━━━━━━━━━━━━━\n"
    order_text += f"👤 <b>ደንበኛ:</b> {username}\n\n"
    
    if company_name:
        order_text += f"🏢 <b>የድርጅት ስም:</b> {company_name}\n"
    if phone:
        order_text += f"📱 <b>ስልክ/አድራሻ:</b> {phone}\n"
    if color:
        order_text += f"🎨 <b>የተመረጠ ቀለም:</b> {color}\n"
    if details:
        order_text += f"📝 <b>ተጨማሪ መመሪያዎች:</b>\n{details}\n"
    
    order_text += f"━━━━━━━━━━━━━━━━━━━━"
    
    # Forward to channel if the CHANNEL_ID has been changed from the placeholder
    if CHANNEL_ID != '@YourChannelUsername':
        try:
            if photos_b64:
                import base64
                first_photo = photos_b64[0]
                if ',' in first_photo:
                    first_photo = first_photo.split(',')[1]
                first_photo_data = base64.b64decode(first_photo)
                
                await context.bot.send_photo(chat_id=CHANNEL_ID, photo=first_photo_data, caption=order_text, parse_mode='HTML')
                
                for photo_b64 in photos_b64[1:]:
                    if ',' in photo_b64:
                        photo_b64 = photo_b64.split(',')[1]
                    photo_data = base64.b64decode(photo_b64)
                    await context.bot.send_photo(chat_id=CHANNEL_ID, photo=photo_data)
            else:
                await context.bot.send_message(chat_id=CHANNEL_ID, text=order_text, parse_mode='HTML')
            
            await update.message.reply_text(f"እናመሰግናለን! የ{service_type} ትዕዛዝዎ ተመዝግቧል። በቅርቡ እናገኝዎታለን።")
        except Exception as e:
            logging.error(f"Failed to send message to channel: {e}")
            await update.message.reply_text("ይቅርታ፣ ትዕዛዝዎን ወደ ቻናል መላክ አልተቻለም። የቻናል ስም በትክክል መሞላቱን ያረጋግጡ እና ቦቱ በቻናሉ ላይ Admin መሆኑን ያረጋግጡ።")
    else:
        # If no channel ID is set, send the confirmation back to user to show it works
        try:
            if photos_b64:
                import base64
                first_photo = photos_b64[0]
                if ',' in first_photo:
                    first_photo = first_photo.split(',')[1]
                first_photo_data = base64.b64decode(first_photo)
                
                await update.message.reply_photo(
                    photo=first_photo_data,
                    caption=f"እናመሰግናለን! የ{service_type} ትዕዛዝዎ በተሳካ ሁኔታ ተቀብለናል!\n\n(ማስታወሻ: በ app.py ውስጥ CHANNEL_ID ስላልተዘጋጀ ወደ ቻናል አልተላከም።)\n\n<b>የትዕዛዙ ዝርዝር፡</b>\n{order_text}", 
                    parse_mode='HTML'
                )
                
                for photo_b64 in photos_b64[1:]:
                    if ',' in photo_b64:
                        photo_b64 = photo_b64.split(',')[1]
                    photo_data = base64.b64decode(photo_b64)
                    await update.message.reply_photo(photo=photo_data)
            else:
                await update.message.reply_text(
                    f"እናመሰግናለን! የ{service_type} ትዕዛዝዎ በተሳካ ሁኔታ ተቀብለናል!\n\n(ማስታወሻ: በ app.py ውስጥ CHANNEL_ID ስላልተዘጋጀ ወደ ቻናል አልተላከም።)\n\n<b>የትዕዛዙ ዝርዝር፡</b>\n{order_text}", 
                    parse_mode='HTML'
                )
        except Exception as e:
            pass

async def handle_direct_media(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler to receive direct voice notes and photos from the chat and forward them."""
    user = update.message.from_user
    username = f"@{user.username}" if user.username else f"{user.first_name}"
    
    caption = f"📎 ተጨማሪ ፋይል ከ: {username}"
    if update.message.caption:
         caption += f"\n\n📝 ማብራሪያ: {update.message.caption}"
         
    # Forward to channel if the CHANNEL_ID has been changed from the placeholder
    if CHANNEL_ID != '@YourChannelUsername':
        try:
            if update.message.voice:
                await context.bot.send_voice(chat_id=CHANNEL_ID, voice=update.message.voice.file_id, caption=caption)
                await update.message.reply_text("የድምፅ መልእክትዎ ደርሶናል፣ እናመሰግናለን!")
            elif update.message.photo:
                # Send the highest resolution photo
                photo_file_id = update.message.photo[-1].file_id
                await context.bot.send_photo(chat_id=CHANNEL_ID, photo=photo_file_id, caption=caption)
                await update.message.reply_text("ፎቶዎ ደርሶናል፣ እናመሰግናለን!")
            elif update.message.document:
                await context.bot.send_document(chat_id=CHANNEL_ID, document=update.message.document.file_id, caption=caption)
                await update.message.reply_text("ፋይልዎ ደርሶናል፣ እናመሰግናለን!")
        except Exception as e:
            logging.error(f"Failed to forward media to channel: {e}")
            await update.message.reply_text("ይቅርታ፣ ፋይሉን ማስተላለፍ አልተቻለም።")
    else:
        await update.message.reply_text("ፋይልዎ ደርሷል! (ማስታወሻ፡ ቻናል ID ስላልተዘጋጀ አልተላለፈም)")

if __name__ == '__main__':
    # Retrieve the token using os.getenv
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    
    # Check if the token is missing, is the default placeholder, or doesn't have the standard colon separator
    if not token or token == "your_bot_token_here" or ":" not in token:
        print("Error: TELEGRAM_BOT_TOKEN is missing or appears incorrect in the .env file.")
        print("Please replace 'your_bot_token_here' with your actual bot token from @BotFather (e.g., 123456789:ABCDef...).")
        exit(1)

    # Build the application with increased timeouts and optional proxy
    proxy_url = os.getenv('PROXY_URL')
    if proxy_url and proxy_url != "http://your_proxy_ip:port":
        print(f"✅ Using Proxy: {proxy_url}")
        request = HTTPXRequest(connect_timeout=30.0, read_timeout=30.0, proxy_url=proxy_url)
    else:
        print("⚠️ WARNING: No valid PROXY_URL found in .env. Attempting direct connection. This may fail with 'httpx.ConnectError' in restricted regions like Ethiopia.")
        request = HTTPXRequest(connect_timeout=30.0, read_timeout=30.0)
        
    app = ApplicationBuilder().token(token).request(request).build()

    # Add handlers
    app.add_handler(CommandHandler('start', start))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    app.add_handler(MessageHandler(filters.VOICE | filters.PHOTO | filters.Document.ALL, handle_direct_media))

    print("Bot is starting...")
    # Start the bot
    app.run_polling()
