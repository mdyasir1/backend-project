const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const tags = []

app.get('/tags', async (req, res) => {
    const tagsData = await prisma.QNA.findMany({
        select: {
            tag: true
        },
        distinct: ['tag']
    })
    res.send(tagsData)
})

app.get('/questions/:topic', async (req, res) => {
    const askedTopic = req.params.topic;

    const totalTopics = await prisma.QNA.findMany({
        select:{tag: true},
        distinct:['tag']
    })
    
    const topic = totalTopics.map(data => data.tag)
    const askedTopicData = await prisma.QNA.findMany({
        select: { question: true, answer: true },
        where: { tag: askedTopic }
    })
    if(!topic.includes(askedTopic)){
        res.send('please enter proper input')
    }else{res.send(askedTopicData)}
    
})

app.listen(2000, () => {
    console.log('done')
})